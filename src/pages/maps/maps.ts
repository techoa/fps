import { IonicPage, NavController } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { TestServiceProvider } from '../../providers/test-service/test-service';
import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';

declare var google;

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  lat: any;
  long: any;
  totalDist:any;
  constructor(private _loginService: TestServiceProvider,private geolocation: Geolocation, public navCtrl: NavController) {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 3000, enableHighAccuracy: true }).then((resp) => {
      this.lat=resp.coords.latitude;
      this.long=resp.coords.longitude;
      this.initMap();
    }).catch((error) => {
        this.lat=28.4510907;
        this.long=77.0692292;
        this.initMap();
      });
    
  }
  initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 10,
      center: {lat: this.lat, lng: this.long},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute(directionsService, directionsDisplay);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    let cord = JSON.parse(localStorage.getItem('map'));
    var waypts = [];
    let counter=0;
    let originv=new google.maps.LatLng(0,0);
    let destinv=new google.maps.LatLng(0,0);
    for(let c of cord){
      counter++;
      let locationc = new google.maps.LatLng(c.lat, c.long);
      waypts.push({
        location: locationc,
        stopover: true
      });
      }
      counter--;
      if(counter==0){
        alert('No Planned Activity for the Day!');
        this.navCtrl.setRoot(DashboardPage);
      }
      else if(counter==1){
        originv=new google.maps.LatLng(cord[0].lat, cord[0].long);
        destinv=new google.maps.LatLng(cord[0].lat, cord[0].long);
      }
      else{
        originv=new google.maps.LatLng(cord[counter].lat, cord[counter].long);
        destinv=new google.maps.LatLng(cord[counter].lat, cord[counter].long);
      }
    directionsService.route({
      origin: originv,
      destination: destinv,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        // For each route, display summary information.
        this.totalDist=0;
        for (var i = 0; i < route.legs.length; i++) {
          this.totalDist+=parseInt(route.legs[i].distance.value);
        }
        alert('Total Distance to be travelled: '+this.totalDist/1000+' KM');
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  logOut(){
    this._loginService.logout();
    this.navCtrl.setRoot(HomePage);
  }
}
