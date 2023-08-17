import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { CreateEmailDto, EmailControllerServiceProxy } from 'shared/service-proxies/service-proxies';





@Component({
  selector: 'app-landing-component',
  templateUrl: './landing-component.component.html',
  styleUrls: ['./css-bootstrap.css','css-style.css','header.css','body.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({ transform: 'translateX(100%)' }))
      ])
    ]),

  ],
})
export class LandingComponentComponent implements OnInit {


//  header start
  isClickedMobileViweIcon: boolean = false;

  navbarstyle: any = {};
  isDisabled: boolean = true;
   moblieNavButtonStyle:any={color:'black'};
  headerScrollStyle: any;
  // header end

  public isSent: boolean = false;
  public isError: boolean = false;
  public name:string = "";
  public email:string = "";
  public phone:string = "";
  public message:string = "";
  public coppyToMe:boolean = false;

  public contacted: boolean = false;
  public tryingContact: boolean= false;

  index: number = 0;
  numImages: number = 4;
  imagesLoaded: number = 0;
  loading: boolean = true;
  imagesUrl = [
    "../../assets/img/slider1.png",
    "../../assets/img/slider2.png",
    "../../assets/img/slider3.png",
    "../../assets/img/slider4.png",
  ]

  constructor(private emailproxy:EmailControllerServiceProxy) { }

  ngOnInit() {
    this.setNavBarstyle();
    this.onResize();



    this.imagesUrl.forEach((x, index) => {
      const image = new Image();
      image.onload = (() => {
        this.imagesLoaded++;
        this.loading = (this.imagesLoaded != this.numImages)
      })
      image.src = x
    })
    interval(5000).subscribe(() => {
      if (!this.loading)
        this.index = (this.index + 1) % this.numImages
    })
  }

  scroll(id: any) {
    let el:any = document.getElementById(id);
    el.scrollIntoView();
  }

  submit(){
    if (this.name === "" || this.email == "" || this.phone == "" || this.message == ""){
      this.isError = true;
    }else{
      this.isError = false;
      let email=new CreateEmailDto()
      email.name= this.name,
      email.email= this.email,
      email.phone= this.phone,
      email.message= this.message
      // const data = {
      //   name: this.name,
      //   email: this.email,
      //   phone: this.phone,
      //   message: this.message
      // }
      if(this.coppyToMe){
        // data["cc"] = this.email
      }
      // console.log(data)
      this.emailproxy.create(email).subscribe(res=>{

        console.log(res)
      },err=>{

        console.log(err)

      })

    }
  }


// header functions start

clickMoblileViewIcon() {

  this.isClickedMobileViweIcon = !this.isClickedMobileViweIcon;
  this.setNavBarstyle();
}


setNavBarstyle() {
  if (this.isDisabled) {
    this.navbarstyle = {};
  } else if (this.isClickedMobileViweIcon) {
    this.navbarstyle = { right: 0 };
  } else {
    this.navbarstyle = { right: '-100%' };
  }
}

@HostListener('window:scroll', [])
onWindowScroll() {
  const scrollOffset =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  if (scrollOffset >= 100) {
   this.moblieNavButtonStyle={color:'white'}
    this.headerScrollStyle = {
      background: '#29BA86',
      padding: '12px 0',
    };
  } else {
    this.moblieNavButtonStyle={color:'black'}
    this.headerScrollStyle = {};
  }
}
@HostListener('window:resize', [])
onResize() {
  // console.log('work1');
  if (window.innerWidth < 1280) {
    this.isDisabled = false;
 
  } else {
    
    this.isDisabled = true;
   
  }
  this.setNavBarstyle();
 
}





}
