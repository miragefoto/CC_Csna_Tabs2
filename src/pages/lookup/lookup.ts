//Add storage access
import { FavoriteProvider } from './../../providers/favorite/favorite';
//Common Controls
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';

// Add BarcodeScanner
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
//Post
import { HttpClient } from '@angular/common/http';

import { IonicSelectableModule } from 'ionic-selectable';

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
  public scanned: boolean = false;
  //options for scanner
  public options: {};
  public users: any;
  public newUser: string;
  public newDepartment: string;
  public loading: any;


  //Control back button
  public unregisterBackButtonAction: any;

  // DI barcodeScanner
  constructor(
    public navCtrl: NavController,
    public barcodeScanner: BarcodeScanner,
    public platform: Platform,
    public navController: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public select: IonicSelectableModule,
    public loadingController: LoadingController,
    public favoriteProvider: FavoriteProvider) {
      this.options = {};
      try {
        if (!this.UserInfo) {
          this.favoriteProvider.getUserInfo().then(
            data => {
              if (data) {
                this.UserInfo = JSON.parse(data);
                this.GetUsers();
              }
            }
          )
        }
      }
      catch (err) {
      }

  }

  ionViewDidLoad() {
    this.initializeBackButtonCustomHandler();
    

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

  //Loader Code
  CreateLoader(source: string) {
    console.log("Loader source: " + source);
    if (!this.loading) {
      this.loading = this.loadingController.create({
        dismissOnPageChange: true,
        content: "Processing...",
        duration: 15000,
        spinner: "bubbles"
      });
      this.loading.present();
    }
  }

  DismissLoader() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
  //END Loader Code





  // new scan method
  scan() {
    if (this.platform.is('mobileweb') || this.platform.is('core')) {
      // This will only print when running on desktop
      console.log("I'm a regular browser!, fake a scan of C70075");
      this.SearchTag("C70075");
      this.num = "Searching!"
      this.scanned = true;
    }
    else {
      //Prod
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
        console.log(JSON.stringify(err));
      }
    }
  }

  //Post Data
  SearchTag(data) {
    this.CreateLoader("SearchTag");
    return new Promise((resolve, reject) => {
      this.http.get(apiBase + "GetScanDetails?scan=" + data + "&api=" + this.UserInfo["userApi"])
        .subscribe(
          res => {
            resolve(res);
            if (res["Error"]) {
              this.scanResult = null;
            }
            else {
              this.scanResult = res;
              try {
                this.scanResult.forEach(element => {
                  if (element["FieldName"] == "Department") {
                    this.newDepartment = element["Value"];
                  }
                  if (element["FieldName"] == "User") {
                    this.newUser = element["Value"];
                  }
                });
              } catch (err) { }
            }
            this.num = data;
          },
          (err) => {
            reject(err);
          },
          () => {
            this.DismissLoader();
          }
        );
    });
  }

  //Get Userlist
  GetUsers() {
    console.log("getting users");
    this.favoriteProvider.getAllUsersList().then(
      data => {
        if(data){
        //  console.log(data["userList"]);
          this.users = data["userList"];
        }
      }
    );
/*
    return new Promise((resolve, reject) => {
      this.http.get(apiBase + "GetAllRequesters?api=" + this.UserInfo["userApi"])
        .subscribe(res => {
          resolve(res);
          if (res["Error"]) {
            this.users = null;
          }
          else {
            this.users = res;
          }
        },
          (err) => {
            reject(err);
          });
    });
    */
  }

  //
  Reassign() {
    if (confirm("Are you sure you want to transfer this item")) {
      this.CreateLoader("Reassign");
      return new Promise((resolve, reject) => {
        this.http.get(apiBase + "Reassign?asset=" + this.num + "&tech=" + this.UserInfo["userApi"] + "&newUser=" + this.newUser)
          .subscribe(
            res => {
              resolve(res);
              if (res["Error"]) {
              }
              else {
                this.SearchTag(this.num);
              }
            },
            (err) => {
              reject(err);
            },
            () => {
              this.DismissLoader();
            }
          );
      });
    }
    else {
      return;
    }
  }



  userChange(event: { component: IonicSelectableModule, value: any}) {
    this.newUser = event.value;
    this.DismissLoader();
  }

  selectClick() {
    this.CreateLoader("selected");
  }
  
  


}
