import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { CallNumber } from '@ionic-native/call-number';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const apiBase = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/";

@IonicPage()
@Component({
  selector: 'page-wo-details',
  templateUrl: 'wo-details.html',
})

export class WoDetailsPage {
  public loading: any;
  public WO: string = "";
  public Desc: string;
  public note: string;
  public workDesc: string;
  public hoursText: string;
  public minutesText: string;
  public closeNote: string;
  public showLog: boolean = false;
  public showNote: boolean = false;
  public showClose: boolean = false;
  public isPublic: boolean = false;
  public addTime: boolean = false;
  public ShowDetail: boolean = true;
  public WorkOrder :any;
  public pics: Array<SafeHtml> = new Array<SafeHtml>();

  public UserInfo: {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController,
    private callNumber: CallNumber,
    public sanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private http: HttpClient) {
    this.CreateLoader("details constructor ");
  }



  ionViewDidLoad() {
    this.WO = this.navParams.get('data');
    this.UserInfo = this.navParams.get('UserInfo');
    this.GetWODetails();
  }

  CloseMe() {
    this.view.dismiss();
  }

  CallNumber(num: string) {
  //  alert("passed number: " +num);
    this.callNumber.callNumber(num.replace(/-/g, ""), true);
    this.callNumber.isCallSupported()
      .then(function (response) {
     //   alert(response);
        if (response == true) {
          try {
            this.callNumber.callNumber(num.replace(/-/g, ""), true);
          } catch (err) {
            alert(JSON.stringify(err));
          }
        }
        else {
          alert("Calling not supported");
          alert(JSON.stringify(response));
        }
      });
  }

  AddNote() {
    //Error Check
    if (!this.note) {
      alert("Description is required");
      return;
    }
    this.CreateLoader("add note");
    let data1 = "isPublic=" + this.isPublic + "&noteText=" + this.note + "&Request=" + this.WO + "&api=" + this.UserInfo["userApi"];

    this.http.get(apiBase + "AddNote?" + encodeURI(data1))
      .subscribe(
        res => {
          this.note = "";
          this.isPublic = false;
          this.toggleNote();
          alert("Completed")
        }, error => {
          console.log(error);
        },
        () => {
          this.DismissLoader();
        }
      );
  }

  AddWorkLog() {
    //Error Check
    if (!this.workDesc) {
      alert("Description is required");
      return;
    }
    this.CreateLoader("Add log");
    let hours = "0";
    let min = "0";
    if (this.hoursText) {
      hours = this.hoursText;
    }
    if (this.minutesText) {
      min = this.minutesText;
    }
    let data1 = "Hours=" + hours + "&Minutes=" + min + "&Description=" + this.workDesc + "&Owner=" + this.UserInfo["username"] + "&Request=" + this.WO + "&api=" + this.UserInfo["userApi"];
    return new Promise((resolve, reject) => {
      this.http.get(apiBase + "AddWorkLog?" + encodeURI(data1))
        .subscribe(
          res => {
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
          },
          () => {
            this.DismissLoader();
          }
        );
    });
  }

  //Get Data
  GetWODetails() {
    return new Promise((resolve, reject) => {
      this.http.get(apiBase + "GetWorkorderDetails?WO=" + this.WO + "&api=" + this.UserInfo["userApi"])
        .subscribe(
          res => {
            this.WorkOrder = res;
            resolve(res);
            for (var i = 0; i < this.WorkOrder.length ; i++) {
              try {
                if (res[i]["FieldName"] == "Description") {
                  this.Desc = res[i]["Value"];
                }
                if (res[i]["FieldType"] == "image2") {
                  let img = res[i]["Value"];
                  this.pics.push('<img src="' + img + '" />');
                }
              }
              catch (err) {
                console.log(err);
                break;
              }
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

  GetEmail(em, id) {
    try {
      return "<a href='mailTo:" + em + "?subject=Workorder: " + id + "'  >" + em + "</a>"
    }
    catch{
      return em
    }
  }

  showImage(img) {
    const sanitizedContent = this.sanitizer.bypassSecurityTrustUrl(img);
    return sanitizedContent;
  }

  toggleLog() { //Close the Tab
    if (this.showLog == true) {
      this.ShowDetail = true;
      this.showLog = false;
    }
    else {//Open Tab
      this.showLog = true;
      this.ShowDetail = false;
    }
    this.showNote = false;
    this.showClose == false;
  }

  toggleNote() {//Close Tab
    if (this.showNote == true) {
      this.ShowDetail = true;
      this.showNote = false;
    }
    else {//Open Tab
      this.showNote = true;
      this.ShowDetail = false;
    }
    this.showClose == false;
    this.showLog = false;
  }
  toggleClose() {// Close Tab
    if (this.showClose == true) {
      this.ShowDetail = true;
      this.showClose = false;
    }
    else { //Open Tab = true;
      this.showClose = true;
      this.ShowDetail = false;
    }
    this.showNote = false;
    this.showLog = false;
  }

  //Close the work order
  CloseWO() {
    this.CreateLoader("close WO");
    var data = "Request=" + this.WO + "&tech=" + this.UserInfo["userApi"] + "&AddTime=" + this.addTime + "&CloseComments=" + this.closeNote + "&techName=" + this.UserInfo["username"];

    return new Promise((resolve, reject) => {
      this.http.get(apiBase + "CloseWO?" + data)
        .subscribe(
          res => {
            resolve(res);
            this.toggleClose();
            alert("Completed")
          },
          (err) => {
            reject(err);
            console.log(err);
          },
          () => {
            this.DismissLoader();
          }
        );
    });
  }

  //Loader Code
  CreateLoader(source: string) {
    console.log("Loader source: " + source);
    if (this.loading) {
      //this.loading.dismiss();
      //this.loading = null;
    }
    else {
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


}
