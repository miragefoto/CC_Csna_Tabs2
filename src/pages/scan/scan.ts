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

const apiUrlSingle = "https://cc-tagscanner-functionapp20181003103414.azurewebsites.net/api/UpdateSingleItem?code=Focr4Hc1Z3yWcfU7J/7IUQl5ktomNFFQgQqt2HIzJAiNjTJSs8P5Fw==";

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  // store the scanned result
  public num: string;
  public location: string;
  public scannedItems: Array<string> = new Array<string>();

  //options for scanner
  public options:{};
  
  //Logs for error and dev
  public logs: string;

  //Create list of usernames
  public Users : Array<string> = ["Will not Smith", "Princess Buttercup", "Kath Leans Left", "Canu Hear Mike now" ];

  //Control back button
  public unregisterBackButtonAction: any;

  public UserInfo : {};

  // DI barcodeScanner
  constructor(
    public navCtrl: NavController, 
    public barcodeScanner: BarcodeScanner, 
    private toaster : ToastController,
    public platform : Platform,
    public navController : NavController,
    public navParams : NavParams,
    public http : HttpClient,
    public favoriteProvider : FavoriteProvider){
      this.options ={};
  
  }

  ionViewDidLoad() {
    try{
    try{
      if(!this.UserInfo){
        this.favoriteProvider.getUserInfo().then(
          data => {
            if(data){
              this.UserInfo = JSON.parse(data);
            }
          }
        )
      }
    }
    catch(err){
      console.log('error: ' +JSON.stringify(err));
    }       

    this.initializeBackButtonCustomHandler();
  
    if(!this.scannedItems || this.scannedItems.length == 0){
      
      this.favoriteProvider.getAllScans().then(
        value => {
          try{
            value.forEach(element => {
              this.scannedItems.push(JSON.stringify(element));
            });
          }
          catch(err){}
      });          
    }
   }
    catch(err){
      this.logs += "Error in ionViewDidLoad(): " + err + "\n";
    }
  }

  ionViewWillLeave() {
  // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function(event){
      try{
        this.barcodeScanner.pop();
      }
      catch(err){
        console.log(err);
      }
    }, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
  }  

  // new scan method
  scan() {
    this.options = {
      prompt : "Scan the Barcode, back to cancel.",
      preferFrontCamera : false, // iOS and Android
      showFlipCameraButton : false, // iOS and Android
      showTorchButton : true, // iOS and Android
      orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
    }
    try{
      this.logs += "Scan buttone registered\n";
          //Get result of scan
        this.barcodeScanner.scan(this.options).then(data => {
          if(!data.cancelled){  // NOT CANCELLED
            // this is called when a barcode is found
            this.num = data.text;
            var thisItem = '{"TagNo":"'+this.num+'", "Location":"'+this.location+'","EditBy":"'+this.UserInfo["username"]+'","Status":"2"}';
      
            this.favoriteProvider.insertScan(JSON.parse(thisItem))
            this.scannedItems.push(JSON.parse(thisItem));
            if(this.scannedItems.length == 0){
              this.scannedItems.push(JSON.parse(thisItem));
              this.favoriteProvider.insertScan(JSON.parse(thisItem))
            }
          
            this.SendSingleData(JSON.parse(thisItem));

            this.cookToast('Scan Completed for tag: '+ this.num);
            //Restart for continuous scanning
            this.scan();
          } 
        });
      }
    catch(err){
      this.logs += "Error in scan(): " + err + "\n";
    }
  
  }


//Clear the memory
  clearscan() {
  if(confirm("Are you sure")){
    try{
      this.favoriteProvider.clearMemory().then(
        value => {
          if(!this.scannedItems){
            this.scannedItems.length = 0;
          }
          else{
            this.scannedItems = [];
          }
          this.logs ='Cleared\n';
          this.logs =this.scannedItems+"\n";
        }
      )
    }
      catch(err){ //ERROR Section 123
          this.logs +='Error section 123: ' + err;
      }

      this.cookToast('Scanning Cleared');
    };
    return this;
  }

  //UserName Save
  onChangeUser(){
    this.favoriteProvider.insertUser(this.UserInfo["username"]);
  }

  //Popups
  cookToast(code){
    let toast = this.toaster.create({
      message  : code,
      duration: 1500,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  //Post Data
  SendSingleData(data){
   return new Promise((resolve, reject) => {
     this.http.post(apiUrlSingle, JSON.stringify(data),{
       headers: new HttpHeaders().set('Content-Type', 'application/json')
       })
     .subscribe(res => {
       resolve(res);
       this.logs +='\nUploaded: '+ JSON.stringify(res);
     }, 
     (err) => {
       reject(err);
      this.logs +='\nError: ' + JSON.stringify(err);
     });
   });
  }

}
