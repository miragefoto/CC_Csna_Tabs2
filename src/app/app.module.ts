import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LookupPage } from '../pages/lookup/lookup';
import { ScanPage } from '../pages/scan/scan';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Barcode scanner
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
//Popups
import { Toast } from '@ionic-native/toast';

//Ionic Storage w sqlLite
import { FavoriteProvider } from './../providers/favorite/favorite';
import { IonicStorageModule } from '@ionic/storage';

//Post functions
import { HttpClientModule  } from '@angular/common/http';
import { CallNumber } from '@ionic-native/call-number';


@NgModule({
  declarations: [
    MyApp,
    LookupPage,
    ScanPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LookupPage,
    ScanPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FavoriteProvider,
    BarcodeScanner,
    Toast,
    CallNumber
  ]
})
export class AppModule {}
