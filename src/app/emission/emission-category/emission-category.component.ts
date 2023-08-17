import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectAndSelectService } from 'app/shared/project-and-select.service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { AppService } from 'shared/AppService';
import { EmissionCategory, Project, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-emission-category',
  templateUrl: './emission-category.component.html',
  styleUrls: ['./emission-category.component.css']
})
export class EmissionCategoryComponent implements OnInit {


  xsd: EmissionCategory;
  display: boolean = false;
  loading: boolean;
  rows: number = 10;
  isView: boolean = false;
  isNewEntry: boolean = true;
  editEntryId: number;
  id: number;

  totalRecords: number;

  emissionCategoryData: EmissionCategory[];
  emissionCategory: EmissionCategory = new EmissionCategory();

  public projects: Project[] = [];
  public units: any

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  creating: boolean = false;

  searchBy: any = {
    text: null,
    usertype: null,
  };

  constructor(
    protected serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    protected messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    protected appService: AppService,
    private projectAndSelectService: ProjectAndSelectService

  ) {

  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    this.setAction();
    this.setInitialState();
  }

  setAction() {
    this.route.url.subscribe(r => {
      if (r[0].path.includes("view")) {
        this.isView = true;
      }
    });
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.editEntryId = parseInt(id);
      this.isNewEntry = false;
    }
  }


  async setInitialState() {
    if (this.id == -1) {

      this.emissionCategory = new EmissionCategory();

    }

    if (this.id > 0) {
      this.editEntryId = this.id
      if (this.editEntryId && this.editEntryId > 0) {

        this.isNewEntry = false;

        this.serviceProxy.getOneBaseEmissionCategoryControllerEmissionCategory(
          this.editEntryId,
          undefined,
          undefined,
          0
        ).subscribe((res: any) => {
          this.emissionCategory = res;

          console.log("reco", res)
        });


      } else {


      }
    }
  }


  load(event: LazyLoadEvent) {
    console.log(event);
    this.loading = true;
    this.totalRecords = 0;


    let typeId = this.searchBy.userType ? this.searchBy.userType.id : 0;
    let filterText = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber = event.first === 0 || event.first == undefined
      ? 1
      : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows == undefined ? 10 : event.rows;

    this.serviceProxy
      .getManyBaseEmissionCategoryControllerEmissionCategory(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        100,
        0,
        pageNumber,
        0
      ).subscribe((res: any) => {
        this.emissionCategoryData = res.data;
        this.totalRecords = res.total;
        this.loading = false;

        console.log('total..', this.totalRecords)
      })

  }

  new() {
    this.isNewEntry = true
    this.isView = false
    this.display = true;
    this.id = -1;
    this.ngOnInit()

  }

  view(id: number) {

    this.display = true;
    this.isView = true
    this.id = id;
    console.log("id--", id)
    this.ngOnInit()

  }

  edit(id: number) {
    this.isNewEntry = false;

    this.display = true;
    this.isView = false
    this.id = id;
    console.log("id--", id)
    this.ngOnInit()

  }

  onBackClick() {
    this.display = false
  }


  showDialog() {
    this.isNewEntry = true
    this.isView = false
    this.display = true;
    this.id = -1;
    this.ngOnInit()


  }

  async save(mitigationForm: NgForm) {
    this.creating = true;

    if (mitigationForm.valid) {

      if (this.isNewEntry) {
        this.serviceProxy
          .createOneBaseEmissionCategoryControllerEmissionCategory(this.emissionCategory)
          .subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'has saved successfully',
              closable: true,
            });
            setTimeout(() => {
              this.display = false;
              this.load({});
            }, 500);
          },
            (error: any) => {
              console.log(error)
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
            },
            () => {
            }
          );


      } else {
        this.serviceProxy.updateOneBaseEmissionCategoryControllerEmissionCategory(this.emissionCategory.id, this.emissionCategory)
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Emission Category is saved successfully',
                closable: true,
              });
            },
            (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
            },
            () => {
              this.creating = false;
              this.display = false;
              this.load({});
            }
          );
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });
      this.creating = false;
    }

  }

  onDeleteClick(id: number) {
    // this.delete(id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this emissionCategory?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.delete(id);
      },
      reject: () => { },
    });
  }

  delete(id: number) {
    this.serviceProxy.deleteOneBaseEmissionCategoryControllerEmissionCategory(id)
      .subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has deleted successfully',
          closable: true,
        });
      }, error => {
        this.messageService.add({
          key:'emc',
          severity: 'warn',
          summary: "Can't delet",
          detail: 'This emission Catogery data may Use some another place',
          // closable: true,
        });
      }, () => this.onSearch())
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.load(event);
  }

}
