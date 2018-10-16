import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpClient, HttpHeaders    } from '@angular/common/http';
import { Sanitizer } from 'angular-sanitize';
import { CallNumber } from '@ionic-native/call-number';
import {RequestOptions } from '@angular/http';
import { FavoriteProvider } from './../../providers/favorite/favorite';
//import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise'

/**
 * Generated class for the WoDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


const apiBase = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/";
const apiUrlSingle = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/GetWorkorderDetails?WO=";
const apiUrlAddNote = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/AddNote";
const apiUrlAddWorkLog  = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/AddWorkLog";


@IonicPage()
@Component({
  selector: 'page-wo-details',
  templateUrl: 'wo-details.html',
})
export class WoDetailsPage {

  private WorkOrder : any;
  public WO : string = "";
  public Desc : string ;
  public note : string;
  public workDesc : string;
  public hoursText : string;
  public minutesText : string;
  public showLog : boolean = false;
  public showNote : boolean = false;
  public isPublic : boolean = false;
  
  public UserInfo : {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private view: ViewController,
    private callNumber: CallNumber, 
    private favoriteProvider : FavoriteProvider,
    private http:HttpClient) {
  }

  ionViewDidLoad() {
    // try{
    //   if(!this.UserInfo){
    //     this.favoriteProvider.getUserInfo().then(
    //       data => {
    //         if(data){
    //           this.UserInfo = JSON.parse(data);
    //         }
    //       }
    //     ) 
    //   }
    // }
    // catch(err){
    //   console.log('error: ' +JSON.stringify(err));
    // }

    console.log(this.navParams.get('data'));
    this.WO = this.navParams.get('data')
    this.UserInfo = this.navParams.get('UserInfo')
    console.log(this.UserInfo);
    this.GetWODetails();
  }

  CloseMe(){
    this.view.dismiss();
  }

CallNumber(num: string){
  this.callNumber.callNumber(num.replace(/-/g,""), true);
  this.callNumber.isCallSupported()
    .then(function (response) {
      alert(response);
      if (response == true) {
        try{
          this.callNumber.callNumber(num.replace(/-/g,""), true);
        }catch(err){
          alert(JSON.stringify(err));
        }
      }
      else {
          alert("Calling not reported");
          alert(JSON.stringify(response));
      }
  });
  
}

AddNote(){

  let data1 = "isPublic="+this.isPublic+"&noteText="+this.note+"&Request="+this.WO+"&api="+this.UserInfo["userApi"] ;
  console.log(data1);
  console.log(encodeURI(data1));
  this.http.get(apiBase+"AddNote?"+encodeURI(data1))
   .subscribe(res => {
     this.note = "";
     this.isPublic = false;
     this.showNote = false;
     alert("Completed")
   }, error => {
     console.log(error);
   });
}

AddWorkLog(){
  let data1 = "Hours=" + this.hoursText + "&Minutes=" + this.minutesText + "&Description="+ this.workDesc + "&Owner=" + this.UserInfo["username"] + "&Request=" +this.WO+"&api="+this.UserInfo["userApi"] ;
  console.log(data1);
  return new Promise((resolve, reject) => {
    this.http.get(apiBase+"AddWorkLog?"+encodeURI(data1))
      .subscribe(res => {
        resolve(res);
        console.log(res);
        this.hoursText = "";
        this.minutesText = "";
        this.workDesc = "";
        this.showLog = false;
        alert("Completed")
      }, 
      (err) => {
      reject(err);
      console.log(err);
      });
  });
}

//Get Data
GetWODetails(){
  console.log(apiBase+"GetWorkorderDetails?WO="+this.WO+"&api="+this.UserInfo["userApi"]);
  return new Promise((resolve, reject) => {
    this.http.get(apiBase+"GetWorkorderDetails?WO="+this.WO+"&api="+this.UserInfo["userApi"] )
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


  toggleLog(){
    if(this.showLog == true){
      this.showLog = false;
    }
    else{
      this.showLog = true;
    }
  }
  toggleNote(){
    if(this.showNote  == true){
      this.showNote = false;
    }
    else{
      this.showNote = true;
    }
  }

 /*
try{
  let headers = new HttpHeaders(
    {
      'content-type' : 'application/json'
    });
    
    let data = {
      'Note' : this.note,
      'isPublic' : "false",
      'Request' : this.WO
        };
    console.log(data);
    return new Promise((resolve, reject) => {
      this.http.post(apiUrlAddNote+ "Json", data,{headers:headers})
      .toPromise()
      .then((response) =>
      {
        console.log('API Response : ', response);
        resolve(response);
      })
      .catch((error) =>
      {
        try{
        console.error('API Error : ', error.status);
        
        console.error('API Error : ', JSON.stringify(error));
        reject(error());
      }
      catch(err){}
      });
    });

  }
  catch(err){

 
*/


}
