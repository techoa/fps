import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TestServiceProvider } from '../../providers/test-service/test-service';
import { HomePage } from '../home/home';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  user:any;
  cdc:any;
  plan: number;
  data: any;
  lat:any;
  long:any;
  agenda : string = '';
  constructor(private geolocation: Geolocation, private http:Http, private _loginService: TestServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.user=null;
    this.cdc=new Date();
    this.plan=0;
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
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.getData();
  }
logOut(){
  this._loginService.logout();
  this.navCtrl.setRoot(HomePage);
}

getData(){
  let body = 'UPNID=h@gmail.com&Date=2018-02-05';
  let headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    
  });
  let options = new RequestOptions({
    headers: headers
  });
  this.http.post('http://162.255.86.134:8080/Get/DCR', body, options).map((response: Response) => response.json())
  .subscribe((data) => 
  this.data=data
);
}
set(da){
  this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
    this.lat=resp.coords.latitude;
    this.long=resp.coords.longitude;
    alert('Name: '+da.tec_dailyactivity3regardingobjectid.value.name+'\n'+'Current Latitude: '+this.lat+'\n'+'Current Longitude: '+this.long);
   }).catch((error) => {
     alert('Location Error '+error.code+' : '+error.message);
   });
}

Send(){
alert(this.data.tec_dailycallrecordid+' '+this.data.systemuser1systemuserid+' '+this.agenda);
}

}
