import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthControllerServiceProxy, CreatableRoles, RefreshReqRes, Role, Roles, UserActions } from './service-proxies/auth-service-proxies';
import { Fuel, ServiceProxy as EsServiceProxy } from './service-proxies/es-service-proxies';
import { BulckDeletDto, BulckDeletDtoEs, EmissionBaseControllerServiceProxy, EmissionSource, Project, ProjectUnitEmissionSourceControllerServiceProxy, PuesDataDto, PuesDataReqDto, PuesDataReqDtoSourceName, ServiceProxy, Unit } from './service-proxies/service-proxies';

import { UserIdleService } from "angular-user-idle";
import { ConfirmationService } from 'primeng/api';
import { User } from './service-proxies/service-proxies';
import { MasterDataService } from 'app/shared/master-data.service';


export enum RecordStatus {
  Deleted = -20,
  InActive = -10,
  Active = 0,
}

export enum AuthData{
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  LOGIN_PROFILE_ID = "LOGIN_PROFILE_ID",
  USER_NAME = "USER_NAME",
  ROLES = "ROLES",
  CREATABLE_ROLES = "CREATABLE_ROLES",
  UNIT_ID = "UNIT_ID",
  UNIT_STATE = "UNIT_STATE",

  ALLOWED_USER_ACTIONS = "ALLOWED_USER_ACTIONS",
  ALLOWED_FP_PROJECTS = "ALLOWED_FP_PROJECTS",
  ALLOWED_UNITS = "ALLOWED_UNITS"
}


export enum SavedData{
  fuels = "fuels",
  units = "units",
  parentUnits = "parentUnits",
  methodologies = "methodologies",
  projectTypes = "projectTypes",
  SelectedProject = "SelectedProject",
  ESLIST = "ESLIST"
}

export enum ProfileStatus {    
  InActive = -10,
  Active = 0,
  Resetting = 1,
  BlockedByWrongAttemps = 2,
  OTPValidated = 3,
  OTPFailed = 4
}
export enum ProjectTypes {    
  GHG = "GHG Inventory",
  SBT = "Smart Net Zero"
}

// Roles.CSI_ADMIN,
export const csiRoles: Roles[] = [
  Roles.CLIMATESI_BA,
  Roles.CLIMATESI_FP,
  Roles.CLIMATESI_HEADS,
  Roles.CLIMATESI_TL,
  Roles.SUPER_ADMIN,
  Roles.CLIMATESI_USERS,
  Roles.CLIMATESI_TRAINEES,
  Roles.MASTER_ADMIN
]

// Roles.CLIMATESI_TRAINEES,
// Roles.EF_MANAGER,

const noUnitSelectable: Roles[] = [Roles.DEO, Roles.CLIMATESI_TRAINEES ]

@Injectable({
  providedIn: 'root',
})
export class AppService {

  projectType: BehaviorSubject<ProjectTypes> = new BehaviorSubject<ProjectTypes>(ProjectTypes.GHG);

  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enableSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * Contains in-progress loading requests
   */
  loadingMap: Map<string, boolean> = new Map<string, boolean>();
  enableSpinnerMap: Map<string, boolean> = new Map<string, boolean>();
  
  private _isAuthenticated: boolean;
  public isDataupdated = new BehaviorSubject<boolean>(true);
  private refreshTokenTimeout: any;

  public parameterUnits: any;
  constructor(
    private confirmationService: ConfirmationService,
    private userIdle: UserIdleService, 
    private router: Router, 
    private authControllerServiceProxy: AuthControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private projectUnitEmissionSourceControllerServiceProxy: ProjectUnitEmissionSourceControllerServiceProxy,
    private masterDataService: MasterDataService,
    private esServiceProxy: EsServiceProxy,
    private emissionBaseControllerServiceProxy: EmissionBaseControllerServiceProxy,
  ) {
    const token = this.getToken();
    this._isAuthenticated = token!==null;
    this.parameterUnits = masterDataService.parameterUnits;
  }

  getMonths(){
    return this.masterDataService.months;
  }

  public forbiddenAction(){
    this.confirmationService.confirm({
      message: 'Please login with premited user account ',
      header: 'You don\'t have access to this resources',
      acceptIcon: 'icon-not-visible',
      acceptLabel: 'Try with another user',
      rejectLabel: 'Cancel',
      accept: () => {
        this.userIdle.resetTimer();
        this.userIdle.stopWatching();
        this.logout();
      },
      reject: () => {
        
      }
    });
  }

  public startIdleTimer() {
    this.userIdle.resetTimer();
    this.userIdle.stopWatching();
    this.userIdle.setConfigValues({idle: 9000, timeout: 1, ping: 6000, idleSensitivity: 100});

    /*Session logout */
    this.userIdle.startWatching(); //Start watching for user inactivity.
    this.userIdle.onTimerStart().subscribe((count) => {});
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      // show dialog
      this.confirmationService.confirm({
        message: 'Please login again ',
        header: 'Session expired',
        acceptIcon: 'icon-not-visible',
        acceptLabel: 'Ok',
        rejectVisible: false,
        accept: () => {
          this.userIdle.resetTimer();
          this.userIdle.stopWatching();
          this.logout();
        },
        reject: () => {
          this.userIdle.resetTimer();
          this.userIdle.stopWatching();
          this.logout()
        }
      });
    });
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  public startRefreshTokenTimer(time=null) {
    const token = this.getToken();
    if(token){
      const jwtToken = JSON.parse(atob(token.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = time === null ? expires.getTime() - ( Date.now() + (60 * 1 * 1000)): time;
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }    
  }

  private refreshToken() {
    let b = new RefreshReqRes();
      let token = this.getRefreshToken()
      if(token){
        b.token =  `${token}`;
      }
      return this.authControllerServiceProxy.refresh(b)
      .pipe(map(res => {
        this.steToken(res.token);
        this.startRefreshTokenTimer();
      }))
  }

  async getUser(): Promise<User | null>{

    const res = await this.serviceProxy.getManyBaseUsersControllerUser(
      undefined,
      undefined,
      [ "status||$ne||"+RecordStatus.Deleted, "loginProfile||$eq||"+this.getProfileId()],
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).toPromise();
    if(res.data.length > 0){
      return res.data[0]
    }
    return null;
  }

  isAuthenticated(): boolean{
    const token = this.getToken();
    return this._isAuthenticated;
  }

  logout(){
    this.clearData();
    this.stopRefreshTokenTimer();
    this.router.navigate(['auth/login']);
  }

  private clearData(){
    localStorage.clear();
  }

  update() {
    this.isDataupdated.next(true);
  }

  setEsList( esList: any[]): void {
    localStorage.setItem(SavedData.ESLIST, JSON.stringify(esList))
  }

  getEsList(): EmissionSource[] {
    let list = localStorage.getItem(SavedData.ESLIST);
    if(list){
      return JSON.parse(list).forEach((l: any) => {
        let e = new EmissionSource();
        e.init(l);
        return e;
      })
    }else{
      return []
    }
  }

  steUnitId(id: number): void {
    localStorage.setItem(AuthData.UNIT_ID, id +"")
  }

  getUnitId(): number {
    let id = localStorage.getItem(AuthData.UNIT_ID);
    return id ? parseInt(id): -1;
  }

  steToken(tocken: string): void {
    localStorage.setItem(AuthData.ACCESS_TOKEN, tocken)
    const token = this.getToken();
    this._isAuthenticated = token!==null;
  }

  getToken(): string | null {
    return localStorage.getItem(AuthData.ACCESS_TOKEN);
  }

  steRoles(roles: Roles[]): void {
    localStorage.setItem(AuthData.ROLES, roles.join(","))
  }

  getRoles(): Roles[] {
    const rolesStr = localStorage.getItem(AuthData.ROLES);
    if(rolesStr){
      return rolesStr?.split(",") as unknown as Roles[];
    }else{
      return [];
    }
  }

  hasUserActionAccessTo(action: UserActions){
    let actions=this.getUserActions();
    let status = actions.includes(action);
    return status;
  }

  steAllowedFtProjectIds(idList: number[]): void {
    localStorage.setItem(AuthData.ALLOWED_FP_PROJECTS, idList.join(","))
  }

  getAllowedFtProjectIds(): number[] {
    const str = localStorage.getItem(AuthData.ALLOWED_FP_PROJECTS);
    if(str){
      return str?.split(",") as unknown as number[];
    }else{
      return [];
    }
  }

  steAllowedUnitIds(idList: number[]): void {
    localStorage.setItem(AuthData.ALLOWED_UNITS, idList.join(","))
  }

  getAllowedUnitIds(): number[] {
    const str = localStorage.getItem(AuthData.ALLOWED_UNITS);
    if(str){
      return str?.split(",") as unknown as number[];
    }else{
      return [];
    }
  }

  steUserAction(action: UserActions[]): void {
    localStorage.setItem(AuthData.ALLOWED_USER_ACTIONS, action.join(","))
  }

  getUserActions(): UserActions[] {
    const actionStr = localStorage.getItem(AuthData.ALLOWED_USER_ACTIONS);
    if(actionStr){
      return actionStr?.split(",") as unknown as UserActions[];
    }else{
      return [];
    }
  }


  steCreatableRoles(roles: CreatableRoles[]): void {
    localStorage.setItem(AuthData.CREATABLE_ROLES, roles.join(","))
  }

  getCreatableRoles(): CreatableRoles[] {
    const rolesStr = localStorage.getItem(AuthData.CREATABLE_ROLES);
    if(rolesStr){
      return rolesStr?.split(",") as unknown as CreatableRoles[];
    }else{
      return [];
    }
  }

  steRefreshToken(tocken: string): void {
    localStorage.setItem(AuthData.REFRESH_TOKEN, tocken)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(AuthData.REFRESH_TOKEN);
  }

  steUserName(userName: string): void {
    localStorage.setItem(AuthData.USER_NAME, userName)
  }

  getUserName(): string | null {
    return localStorage.getItem(AuthData.USER_NAME);
  }

  steProfileId(profileId: string): void {
    localStorage.setItem(AuthData.LOGIN_PROFILE_ID, profileId)
  }

  getProfileId(): string | null {
    return localStorage.getItem(AuthData.LOGIN_PROFILE_ID);
  }

  steUnitState(state: string): void {
    localStorage.setItem(AuthData.UNIT_STATE, state)
  }

  getUnitState(): string {
    let state = localStorage.getItem(AuthData.UNIT_STATE);
    return state ? state : "";
  }


  /**
   * Sets the loadingSub property value based on the following:
   * - If loading is true, add the provided url to the loadingMap with a true value, set loadingSub value to true
   * - If loading is false, remove the loadingMap entry and only when the map is empty will we set loadingSub to false
   * This pattern ensures if there are multiple requests awaiting completion, we don't set loading to false before
   * other requests have completed. At the moment, this function is only called from the @link{HttpRequestInterceptor}
   * @param loading {boolean}
   * @param url {string}
   */
   setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error('The request URL must be provided to the LoadingService.setLoading function');
    }
    if (loading) {
      this.loadingMap.set(url, loading);
      this.loadingSub.next(true);
    }else if (!loading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.loadingSub.next(false);
    }
  }

  setProjectType(type: ProjectTypes){
    this.projectType.next(type);
  }

  setEnableSpinner(enabled: boolean, url: string): void {
    // if (!url) {
    //   throw new Error('The request URL must be provided to the ApService.setEnableSpinner function');
    // }
    if (enabled) {
      this.enableSpinnerMap.set(url, enabled);
      this.enableSpinner.next(true);
    }else if (!enabled && this.enableSpinnerMap.has(url)) {
      this.enableSpinnerMap.delete(url);
    }
    if (this.enableSpinnerMap.size === 0) {
      this.enableSpinner.next(false);
    }
  }

  listenToSpinner(){
    return this.enableSpinner.asObservable();
  }


  async getPUESData(project: Project, sourceName: PuesDataReqDtoSourceName, unit: Unit | null): Promise<PuesDataDto>{
    let body = new PuesDataReqDto();
    body.project = project;
    body.sourceName = sourceName;
    if(unit){
      body.unitId = unit.id;
    }else{
      let u = this.getUnitId();
      if(u){
        body.unitId = u;
      }
    }
    const res = await this.projectUnitEmissionSourceControllerServiceProxy.getPuesData(body).toPromise();
    return res;
  }

  async getLogedUnit():Promise<Unit | null>{
    let unitId = this.getUnitId();
    if(unitId){
      return await this.serviceProxy.getOneBaseUnitControllerUnit(unitId,undefined,undefined,0).toPromise();
    }else{
      return null;
    }
  }

  isOnlyForcalPoint(){
    let roles = this.getRoles();
    return roles.some(role => role === Roles.CLIMATESI_FP);
  }

  isOnlyOperationalAdmin(){
    let roles = this.getRoles();
    return roles.some(role => role === Roles.OPERATIONAL_ADMIN);
  }

  isFM(){
    let roles = this.getRoles();
    return roles.some(role => role === Roles.FINANCIAL_MANAGER);
  }

  isOnlyCSITrainee(){
    let roles = this.getRoles();
    return roles.some(role => role === Roles.CLIMATESI_TRAINEES);
  }


  /**
   * This method can be used to check use is allowd rto select unit
   * 
   * @returns bool
   */
  isAnyAdmin(){ // TODO: rename as isUnitSelectable
    let roles = this.getRoles();
    return !roles.every(role => noUnitSelectable.includes(role));
    // return roles.some(role => role.toString().endsWith('ADMIN'));
  }

  isCSIUser(){
    let roles = this.getRoles();
    return roles.some(rr =>csiRoles.includes(rr))
  }

  isORGAdmin(){
    let roles = this.getRoles();
    return roles.some(rr => rr === Roles.COM_ADMIN)
  }
  
  isAuditor(){
    let roles = this.getRoles();
    return roles.some(rr => rr === Roles.AUDITOR)
  }

  getYear(isFy: boolean, year: number | string, fyFrom: moment.Moment, fyTo: moment.Moment, isAllMonth: boolean=false){
    console.log(isFy, year, fyFrom, fyTo, isAllMonth);
    if(!isFy){
      return year as number;
    }else{
      if(isAllMonth){
        if((12-fyFrom.month())>=fyTo.month()){
          return fyFrom.year();
        }else{
          return fyTo.year();
        }
      }else{
        const date = new Date();
        // date.setFullYear() // TODO: change with month
        return date.getFullYear();
      }
    }
  }



  async getFuels(){
    try{
      let savedFuels =  localStorage.getItem("fuels");
      if(savedFuels){
        return JSON.parse(savedFuels) as Fuel[];
      }else{
        let fuels  = await this.esServiceProxy.getManyBaseFuelControllerFuel(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0
        ).toPromise();
        localStorage.setItem("fuels", JSON.stringify(fuels.data))
        return fuels.data;
      }
    }catch(er){
      console.log(er);
      return [];
    }
  }
  
  async validateMonth(source: string, projectId: number, unitId: number, year: string, month: number){
    return await this.emissionBaseControllerServiceProxy.validateMonth(source, projectId, unitId, year, month).toPromise()
  }

  async bulkDelete(source: string,ids: number[], ref: any,isPerment: boolean = false){
    this.confirmationService.confirm({
      message: 'These data cannot be recovered again',
      header: 'Are you sure? Do you want to delete all select data?',
      acceptIcon: 'icon-not-visible',
      acceptLabel: 'Delete All',
      rejectLabel: 'Cancel',
      accept: async () => {
        let req = new BulckDeletDto();
        req.ids = ids;
        req.es = source as unknown as BulckDeletDtoEs;
        req.isPermant = true;
        try{
          await this.emissionBaseControllerServiceProxy.bulkDelete(req).toPromise();
          ref.deleteAllSuccess();
        }catch(er){
          console.log(er);
          ref.deleteAllFailed();
        }
      },
      reject: () => {
        
      }
    });

  }
}
