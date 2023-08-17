import { Component, HostListener } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { delay } from 'rxjs/operators';
import { AppService } from 'shared/AppService';
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, DialogService],
})
export class AppComponent {
  title = 'icat-country-portal-web-app';
  togglemenu: boolean = true;
  innerWidth = 0;
  loading: boolean = false;
  loadingEnabled: boolean = false;


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }
  

  constructor(private appService: AppService){
    this.appService.startRefreshTokenTimer();
    this.appService.startIdleTimer();
  }


  listenToLoading(): void {
    // this.appService.loadingSub.asObservable();

    this.appService.listenToSpinner().subscribe(res => {
      this.loadingEnabled = res;
    })

    this.appService.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
        if (this.loading) {
          // this.spinner.show()
        }else {
          // this.spinner.hide()
        }
      });
  }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.listenToLoading()
  }
}
