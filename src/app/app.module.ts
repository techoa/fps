import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Geolocation } from '@ionic-native/geolocation';
import { MSAdal } from '@ionic-native/ms-adal';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { TestServiceProvider } from '../providers/test-service/test-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    DashboardPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    DashboardPage
  ],
  providers: [
    StatusBar,
    TextToSpeech,
    AndroidFingerprintAuth,
    Geolocation,
    SplashScreen,
    MSAdal,
    TestServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
