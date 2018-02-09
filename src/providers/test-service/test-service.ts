import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal';
import {  LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TestServiceProvider{

  data: any;
  constructor(public http: Http,private msAdal: MSAdal, public loading: LoadingController, private tts: TextToSpeech){
    this.data = null;
  }
    adal(){

        if (this.data) {
          return Promise.resolve(this.data);
        }

 var authContext = this.msAdal.createAuthenticationContext("https://login.windows.net/common");
 authContext.tokenCache.clear();
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
          this.data = data;
          localStorage.setItem('currentUser', JSON.stringify({ Name: data.userInfo.givenName, EMail: data.userInfo.uniqueId }));
          resolve(this.data);
          loading.dismiss();
          })
          .catch((e: any) =>{
            loading.dismiss();
            alert("Please Login with your Official Microsoft Account to continue.");
          } );
          
        });
      }

      logout(){
 localStorage.removeItem('currentUser');
 var authContext = this.msAdal.createAuthenticationContext("https://login.windows.net/common");
 authContext.tokenCache.clear();
      }

}