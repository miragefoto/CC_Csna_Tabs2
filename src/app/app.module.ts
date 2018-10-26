import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
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

import { IonicSelectableModule } from 'ionic-selectable';
import { Pro } from '@ionic/pro';



Pro.init('779481ff', {
  appVersion: '0.0.2'
})


@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}




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
    IonicSelectableModule,
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

    IonicErrorHandler,
    [{ provide: ErrorHandler, useClass: MyErrorHandler }],
    FavoriteProvider,
    BarcodeScanner,
    Toast,
    CallNumber
    
  ]
})
export class AppModule {}
