import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sanitizer } from 'angular-sanitize';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the WoDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const apiUrlSingle = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/GetOpenWorkorderDetailsJson?WO=";


@IonicPage()
@Component({
  selector: 'page-wo-details',
  templateUrl: 'wo-details.html',
})
export class WoDetailsPage {

  private WorkOrder : any;
  public WO : string = "";
  public Desc : string ;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private view: ViewController,
    private callNumber: CallNumber, 
    private http:HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WoDetailsPage');
    console.log(this.navParams.get('data'));
    this.WO = this.navParams.get('data')
    this.GetWODetails();
  }

  CloseMe(){
    this.view.dismiss();
  }

CallNumber(num){
  this.callNumber.isCallSupported()
  .then(function (response) {
      if (response == true) {
        this.callNumber.callNumber(num, true);
      }
      else {
          alert("Calling not reported");
      }
  });


  
}

//Get Data
GetWODetails(){
  
  return new Promise((resolve, reject) => {
    this.http.get(apiUrlSingle+this.WO )
    .subscribe(res => {
      resolve(res);
      console.log(res);
      this.WorkOrder = res;
      this.Desc = (res)[3]["Value"];
      console.log(this.Desc);
      
    }, 
    (err) => {
      reject(err);
    });
  });
}

}
