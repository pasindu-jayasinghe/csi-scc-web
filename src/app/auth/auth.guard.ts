import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'shared/AppService';
import { Roles } from 'shared/service-proxies/auth-service-proxies';
import { UnitStatus } from 'shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private router: Router, private appService: AppService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {

    // console.log("AuthGuard")
    let authenticated = this.appService.isAuthenticated();
    // console.log("authenticated ", authenticated)
    if (!authenticated){
      this.appService.logout();
      return false;
    }

    let unitStatus = this.appService.getUnitState();

    if (route.data && route.data["roles"] !== undefined){
      const currentRoles = this.appService.getRoles();
      let requiredRoles = route.data["roles"] as Roles[];
      let some = requiredRoles.some((r: Roles) => currentRoles.includes(r));
      if (some && unitStatus === UnitStatus.APPROVED.toString()){
        return true;
      }else{
        this.appService.logout();
        return false;
      }
    }else{            
      let s =  unitStatus === UnitStatus.APPROVED.toString();
      if(s){
        return true;
      }else{
        this.appService.logout();
        return false;
        // return false;
      }
    }
    
    return true;
  }
  
}
