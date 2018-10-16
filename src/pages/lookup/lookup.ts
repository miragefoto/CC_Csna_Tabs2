//Add storage access
import { FavoriteProvider } from './../../providers/favorite/favorite';
//Common Controls
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
// Add popups
import { ToastController } from 'ionic-angular';
// Add BarcodeScanner
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
//Post
import { HttpClient, HttpHeaders } from '@angular/common/http';

const apiBase = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/";

@Component({
  selector: 'page-lookup',
  templateUrl: 'lookup.html'
})
export class LookupPage {

  public num: string;
  public location: string;
  public UserInfo: {};
  public scanResult: any;
  public scanned : boolean = false;
  //options for scanner
  public options: {};

  //Control back button
  public unregisterBackButtonAction: any;

  // DI barcodeScanner
  constructor(
    public navCtrl: NavController,
    public barcodeScanner: BarcodeScanner,
    private toaster: ToastController,
    public platform: Platform,
    public navController: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public favoriteProvider: FavoriteProvider) {
    this.options = {};
  }

  ionViewDidLoad() {
    this.initializeBackButtonCustomHandler();
    try {
      if (!this.UserInfo) {
        this.favoriteProvider.getUserInfo().then(
          data => {
            if (data) {
              this.UserInfo = JSON.parse(data);
            }
          }
        )
      }
    }
    catch (err) {
    }

  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function (event) {
      console.log('Prevent Back Button Page Change');
      try {
        this.barcodeScanner.pop();
      }
      catch (err) {
        console.log(err);
      }
    }, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */

  }

  // new scan method
  scan() {
    this.scanned = true;
    try {
      this.options = {
        prompt: "Scan the Barcode, back to cancel.",
        preferFrontCamera: false, // iOS and Android
        showFlipCameraButton: false, // iOS and Android
        showTorchButton: true, // iOS and Android
        orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      }

      //Get result of scan
      this.barcodeScanner.scan(this.options).then(data => {
        if (!data.cancelled) {  // NOT CANCELLED
          // this is called when a barcode is found
          this.num = "Searching";
          
          this.SearchTag(data.text);
        }
      });

    }
    catch (err) {
    }

  }

  //Post Data
  SearchTag(data) {
    return new Promise((resolve, reject) => {
      //GetScanDetails?scan=C71207&api=B45CD816-74D0-4DE9-9CFC-EF860AFC84A3
      this.http.get(apiBase + "GetScanDetails?scan=" + data + "&api=" + this.UserInfo["userApi"])
        .subscribe(res => {
          resolve(res);
          if(res["Error"]){
            this.scanResult = null;
            
          }
          else{
          this.scanResult = res;
          
          }
          this.num = data;
        },
          (err) => {
            reject(err);
          });
    });
  }











}
