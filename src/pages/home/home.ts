import { Component } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { Platform, NavController, LoadingController } from 'ionic-angular';
import { TestServiceProvider } from '../../providers/test-service/test-service';
import { TabsPage } from '../tabs/tabs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  plat: string;
  at: any;
  constructor( private _loginService: TestServiceProvider,public loading: LoadingController,private androidFingerprintAuth: AndroidFingerprintAuth, public navCtrl: NavController, private tts: TextToSpeech, private platform: Platform){
    if (this.platform.is('ios')) {this.plat="IOS";}
    if (this.platform.is('android')) {this.plat="Android";}
    this.tts.speak('Welcome to the GreenPly\'s App for '+this.plat+'. Please login by clicking on the icon.').then(() => console.log('TTS used')).catch((reason: any) => console.error(reason));
  }
  
fps(){
  this.tts.speak('Please Authenticate to continue.').then(() => console.log('TTS used')).catch((reason: any) => console.error(reason));
  this.androidFingerprintAuth.isAvailable()
  .then((result)=> {
    if(result.isAvailable){

      this.androidFingerprintAuth.encrypt({ clientId: 'GreenPlyApp' })
        .then(result => {
           if (result.withFingerprint) {
            this.navCtrl.setRoot(TabsPage);
            //this.tts.speak(result.token).then(() => console.log('TTS used')).catch((reason: any) => console.error(reason));
           } else if (result.withBackup) {
            this.navCtrl.setRoot(TabsPage);
          } else this.tts.speak('Canceled. Click on the lock icon again.').then(() => console.log('TTS used')).catch((reason: any) => console.error(reason));
        })
        .catch(error => {
           if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
            this.tts.speak('Canceled. Click on the lock icon again.').then(() => console.log('TTS used')).catch((reason: any) => console.error(reason));
           } else console.error(error)
        });

    } else {
      this.tts.speak('Your device does not have a fingerprint scanner.').then(() => console.log('TTS used')).catch((reason: any) => console.error(reason));
    }
  })
  .catch(error => console.error(error));
}

login() {
if(JSON.parse(localStorage.getItem('currentUser'))!=null){
this.fps();
  }
  else{
    this._loginService.adal();
  }
}
  
}