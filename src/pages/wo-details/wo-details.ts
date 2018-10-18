import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpClient, HttpHeaders    } from '@angular/common/http';
//import { Sanitizer } from 'angular-sanitize';
import { CallNumber } from '@ionic-native/call-number';
import { RequestOptions } from '@angular/http';
import { FavoriteProvider } from './../../providers/favorite/favorite';
//import {SafePipe } from '../../app/SafePipe';
//import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise'
import { NgModel } from '@angular/forms';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
/**
 * Generated class for the WoDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


const apiBase = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/";

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
  public ShowDetail : boolean = true;
  public pics : Array<SafeHtml> = new Array<SafeHtml>();
  
  public UserInfo : {};
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private view: ViewController,
    private callNumber: CallNumber, 
    public sanitizer : DomSanitizer,
    private favoriteProvider : FavoriteProvider,
    private http:HttpClient) {
  }

 

  ionViewDidLoad() {

    //console.log(this.navParams.get('data'));
    this.WO = this.navParams.get('data')
    this.UserInfo = this.navParams.get('UserInfo')
    //console.log(this.UserInfo);
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
  
  this.http.get(apiBase+"AddNote?"+encodeURI(data1))
   .subscribe(res => {
     this.note = "";
     this.isPublic = false;
     this.toggleNote();
     alert("Completed")
   }, error => {
     console.log(error);
   });
}

AddWorkLog(){
//Error Check
if(!this.workDesc){
  alert("Description is required");
  return;
}
  let hours = "0";
  let min = "0";
  if(this.hoursText){
    hours = this.hoursText;
  }
  if(this.minutesText){
    min = this.minutesText;
  }
  let data1 = "Hours=" + hours  + "&Minutes=" + min + "&Description="+ this.workDesc + "&Owner=" + this.UserInfo["username"] + "&Request=" +this.WO+"&api="+this.UserInfo["userApi"] ;
    return new Promise((resolve, reject) => {
    this.http.get(apiBase+"AddWorkLog?"+encodeURI(data1))
      .subscribe(res => {
        resolve(res);
  
        this.hoursText = "";
        this.minutesText = "";
        this.workDesc = "";
        this.toggleLog();
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
      
      this.WorkOrder = res;
      for (var i = 0; i < 100; i++) { 
        try{
          if( res[i]["FieldName"] == "Description"){
            this.Desc = res[i]["Value"];
          }
          if( res[i]["FieldType"] == "image2"){
            let img = res[i]["Value"];
            this.pics.push('<img src="'+ img + '" />');
          }
        }
        catch(err){
          break;
        }
      }

    }, 
    (err) => {
      reject(err);
    });
  });
}

showImage(img){
  const sanitizedContent = this.sanitizer.bypassSecurityTrustUrl(img);
  return sanitizedContent;
}




  toggleLog(){
    if(this.showLog == true){
      this.showLog = false;
      this.ShowDetail = true;
    }
    else{
      this.showLog = true;
      this.ShowDetail = false;
    }

  }
  toggleNote(){
    if(this.showNote  == true){
      this.showNote = false;
      this.ShowDetail = true;
    }
    else{
      this.showNote = true;
      this.ShowDetail = false;
    }
  }



}
