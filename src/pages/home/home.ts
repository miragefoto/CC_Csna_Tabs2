import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
//Add storage access
import { FavoriteProvider } from './../../providers/favorite/favorite';
import { HttpClient } from '@angular/common/http';
import { TabsPage } from '../tabs/tabs'

import { CallNumber } from '@ionic-native/call-number';

const apiBase = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/";
const msInDay = 86400000;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user: string;
  public apiKey: string;
  public techId: string;
  public WorkOrders: any;
  public UserInfo: {};
  public loading: any;
  

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public modal: ModalController,
    private callNumber: CallNumber,
    public loadingController: LoadingController,
    public favoriteProvider: FavoriteProvider) {
      this.CheckForUser();
  }



  CallNumber(num: string) {
    //alert("passed number: " +num);
    this.callNumber.callNumber(num.replace(/-/g, ""), true);
    this.callNumber.isCallSupported()
      .then(function (response) {
      
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
  0}


  ionViewDidLoad() {
  }

  CheckForUser(){
    try {
      if (!this.UserInfo) {
        this.favoriteProvider.getUserInfo().then(
          data => {
            if (data) {
              this.UserInfo = JSON.parse(data);
              this.apiKey = this.UserInfo["userApi"] || " ";
              this.user = this.UserInfo["username"];
              this.techId = this.UserInfo["techId"];
              this.UserInfo = { username: this.user, userApi: this.apiKey, techId: this.techId };
              this.GetUsers();
            }
          }
        )
      }
    }
    catch (err) {
      console.log('error: ' + JSON.stringify(err));
    }
  }

  //Loader Code
  CreateLoader(source: string) {
    //console.log("Loader source: " + source);
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

  //Save the API key to local storage
  SaveApi(apiKeyIn: string) {
    this.CreateLoader("SaveApi");
    this.apiKey = this.apiKey.trim();
    return new Promise((resolve, reject) => {
      this.http.get(apiBase + "GetTechInfo?api=" + apiKeyIn)
        .subscribe(
          res => {
            resolve(res);
            this.apiKey = apiKeyIn;
            this.user = res["parameters"][1]["value"];
            this.techId = res["parameters"][0]["value"];
            this.UserInfo = { username: this.user, userApi: apiKeyIn, techId: this.techId };
            this.favoriteProvider.insertUserInfo(JSON.stringify(this.UserInfo)).then(
              data => {
                this.navCtrl.setRoot(TabsPage);
              }
            )
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

  OpenDetail(id: string) {
    const modalData: string = id
    const modalUser: {} = this.UserInfo;
    const detailModal = this.modal.create('WoDetailsPage', { data: modalData, UserInfo: modalUser });
    detailModal.present();
  }


  GetWorkorders() {
    //Prod
    this.GetWO();
  }

  //Post Data
  GetWO() {
    this.CreateLoader("GetWO");
    return new Promise((resolve, reject) => {
      this.http.get(apiBase + "GetOpenWorkorders2?api=" + this.apiKey)
        .subscribe(
          res => {
            resolve(res);
            this.WorkOrders = res;
            this.DismissLoader();
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

  //Get user list async and save to storage, if empty over a day old
  //Get Userlist

  GetUsers() {
    try {
        this.favoriteProvider.getAllUsersList().then(
          data => {
            if (data) {
              var today = new Date().valueOf();
              if(data["validDate"] < (today - msInDay)  ){
                return new Promise((resolve, reject) => {
                  this.http.get(apiBase + "GetAllRequesters?api=" + this.UserInfo["userApi"])
                    .subscribe(
                      res => {
                      resolve(res);
                        var userList :any = {validDate : new Date().valueOf(),userList : res};
                        this.favoriteProvider.insertAllUserList(userList);
                      },
                      (err) => {
                        reject(err);
                      });
                });
              }
            }
            else{ //There is no data saved
              return new Promise((resolve, reject) => {
                this.http.get(apiBase + "GetAllRequesters?api=" + this.UserInfo["userApi"])
                  .subscribe(
                    res => {
                    resolve(res);
                      var userList :any = {validDate : new Date().valueOf(),userList : res};
                      this.favoriteProvider.insertAllUserList(userList);
                    },
                    (err) => {
                      reject(err);
                    });
                 });
            }
          }
        )
      }
      catch (err) {
      console.log('error: ' + JSON.stringify(err));
    }
  }


  // END OF THE WORLD
}
