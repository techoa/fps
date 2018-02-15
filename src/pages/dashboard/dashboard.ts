import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TestServiceProvider } from '../../providers/test-service/test-service';
import { HomePage } from '../home/home';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  user:any;
  loacstatus:boolean;
  cdc:any;
  plan: number;
  data: any;
  lat:string;
  long:string;
  sub:string;
  agenda : string = '';
  desc: string;
  dataObject: any;
  conStatus:boolean;
  email:any;
  constructor(private loading: LoadingController,private alertCtrl: AlertController,private geolocation: Geolocation, private http:Http, private _loginService: TestServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.user=null;
    this.cdc=new Date();
    this.plan=0;
    this.sub="Not Def";
    this.agenda="Not Def";
    this.desc="Not Def";
    this.loacstatus=false;
    this.dataObject=null;
    this.conStatus=false;
  }
  onChange(selectedValue){
    if(selectedValue=='planned'){
      this.plan=1;
    }
    else{
      this.plan=2;
    }
  }
  ngOnInit(){
    localStorage.removeItem('map');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.email=this.user.EMail;
    this.getData();
  }
logOut(){
  this._loginService.logout();
  this.navCtrl.setRoot(HomePage);
}

getData(){
  let d=(this.cdc.getFullYear()+'-'+(this.cdc.getMonth()+1)+'-'+this.cdc.getDate()).toString();
  //let d="2018-02-14";
  let body = 'UPNID='+this.email+'&Date='+d;
  let headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  let options = new RequestOptions({
    headers: headers
  });
  this.http.post('http://162.255.86.134:8080/Get/DCR', body, options).map((response: Response) => response.json())
  .subscribe((data) => 
  {
    this.data=data;
    this.mapLoad(data);
  }
);
}
set(da){
this.dataObject=da;
}
addAgenda(agenda){
this.agenda=agenda;
}


Send(){
  if(this.plan==1){
    //planned
    if(this.dataObject!=null){
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      this.lat=resp.coords.latitude.toString();
      this.long=resp.coords.longitude.toString();
      this.loacstatus=true;
     }).catch((error) => {
       alert('Location Error. Please Turn On Location and try again.\n'+error.code+' : '+error.message);
       this.loacstatus=false;
     });
     let loading = this.loading.create({
      content: 'Collecting Data to POST. Please Wait.'
    });
    loading.present();
   setTimeout(() => {
     loading.dismiss();
     if(this.loacstatus==true){
     let rdata =
       [{
        "Subject":  "",
        "ActivityId": this.dataObject.tec_dailyactivity3activityid.value,
        "DateTime": "2018-02-15",
        "Time": "16:25:58",
        "DCRID": this.dataObject.tec_dailycallrecordid,
        "DailyActivityType": "Planned",
        "Agenda": this.agenda,
        "UserId": this.dataObject.systemuser1systemuserid.value,
        "Latitude": this.lat,
        "Longitude": this.long,
        "Description": this.desc,
        "ActualDistance": "200",
        "PlannedDistance": "175",
        "WorkingHours": "1:2"
      }];
      var reqdata=JSON.stringify(rdata);
      //////////////////////////////////////////////////////////////
      let calert = this.alertCtrl.create({
        title: 'Confirm Posting Planned Activity',
        message: 'Subject: '+this.sub+'\nAgenda: '+this.agenda+'\nDescription: '+this.desc,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              alert('Data Posting Cancelled!');
            }
          },
          {
            text: 'Confirm',
            handler: () => {
              this.PostData(reqdata);
            }
          }
        ]
      });
      calert.present();
      //////////////////////////////////////////////////////////////
  }
  else{
    alert('Switch ON your device location to post an entry.');
  }
},2000);
  }else{
    alert('Please select a checkbox to post an entry!');
  }
}
  else if(this.plan==2){
    //unplanned
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      this.lat=resp.coords.latitude.toString();
      this.long=resp.coords.longitude.toString();
      this.loacstatus=true;
     }).catch((error) => {
       alert('Location Error. Please Turn On Location and try again. '+error.code+' : '+error.message);
     });
      let loading = this.loading.create({
        content: 'Collecting Data to POST. Please Wait.'
      });
      loading.present();
     setTimeout(() => {
       loading.dismiss();
     if(this.loacstatus==true){
     let rdata =
       [{
        "Subject":  this.sub,
        "ActivityId": "",
        "DateTime": "2018-02-15",
        "Time": "16:25:58",
        "DCRID": this.data[0].tec_dailycallrecordid,
        "DailyActivityType": "Unplanned",
        "Agenda": this.agenda,
        "UserId": this.data[0].systemuser1systemuserid.value,
        "Latitude": this.lat,
        "Longitude": this.long,
        "Description": this.desc,
        "ActualDistance": "200",
        "PlannedDistance": "175",
        "WorkingHours": "1:2"
      }];
      var reqdata1=JSON.stringify(rdata);
      //////////////////////////////////////////////////////////////
      let calert = this.alertCtrl.create({
        title: 'Confirm Posting Unplanned Activity',
        message: 'Subject: '+this.sub+'\nAgenda: '+this.agenda+'\nDescription: '+this.desc,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              alert('Data Posting Cancelled!');
            }
          },
          {
            text: 'Confirm',
            handler: () => {
              this.PostData(reqdata1);
            }
          }
        ]
      });
      calert.present();
      //////////////////////////////////////////////////////////////
  }
  else{
    alert('Switch ON your device location to post an entry.');
  }
},3000);
  }

}

PostData(reqDATA){
  let h = new Headers({
    'Content-Type': 'application/json'
  });
  let o = new RequestOptions({
    headers: h
  });
  let loading = this.loading.create({
    content: 'POSTING DATA TO SERVER. Please Wait.'
  });
  loading.present();

  this.http.post('http://162.255.86.134:8080/Emp/Activity/Create/Update', reqDATA, o).map((response: Response) => response.json())
  .subscribe((output) => {
  loading.dismiss();
  alert(output+' entry Posted Successfully.');
  this.loacstatus=false;
  this.sub='';
  this.agenda='';
  this.lat='';
  this.long='';
  this.desc='';
  this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  ), error => {
    loading.dismiss();
    alert('Error posting data!');// Error getting the data
  };
}
mapLoad(data){
  var loc = [];
  for(let d of data){
    loc.push({
      name : d.tec_dailyactivity3regardingobjectid.value.name,
      lat : d.account4tec_latitude.value,
      long : d.account4tec_longitude.value
    });
  }
  localStorage.setItem('map', JSON.stringify(loc));
}
}
