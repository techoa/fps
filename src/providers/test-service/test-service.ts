import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal';
import {  LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TestServiceProvider{

  authenticated: boolean = false;
  data: any;
  accesstoken:any;
  constructor(public http: Http,private msAdal: MSAdal, public loading: LoadingController, private tts: TextToSpeech){
    this.data = null;
    this.accesstoken=null;
  }
    adal(){
        if (this.data) {
          return Promise.resolve(this.data);
        }
        this.tts.speak('Please Login with your Official Microsoft Account.').then(() => console.log('TTS used')).catch((reason: any) => console.error(reason));
        return new Promise(resolve => {
        var extraQueryParams = 'nux=1';
        var userId = "";
        var clientid='a5d92493-ae5a-4a9f-bcbf-9f1d354067d3';
        var redirectUri = 'http://MyDirectorySearcherApp';
        var authority = 'https://login.windows.net/common';
        var resourceUri = 'https://graph.windows.net';
        let loading = this.loading.create({content : "Logging in, please wait..."});
        loading.present();
        let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext(authority);
        authContext.acquireTokenAsync(resourceUri, clientid, redirectUri,userId,extraQueryParams)
          
        .then((data: AuthenticationResult) => {  
          this.authenticated=true;
          this.data = data;
          this.getUser();
          resolve(this.data);
          loading.dismiss();
          })
          .catch((e: any) =>{
            loading.dismiss();
            alert("Please Login with your Official Microsoft Account to continue.");
          } );
          
        });
      }
  getUser(){
    this.http.get('https://www.reddit.com/r/gifs/new/.json?limit=10').map(res => res.json()).subscribe(data => {
    alert(data.data.children);
});
  }

}



