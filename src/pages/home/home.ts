import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
//Add storage access
import { FavoriteProvider } from './../../providers/favorite/favorite';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {TabsPage} from '../tabs/tabs'

const apiBase = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user: string;
  public apiKey : string;
  public techId :string;
  public WorkOrders: any;
  public UserInfo : {} ;

  constructor(
    public navCtrl: NavController,
    public http : HttpClient,
    public modal: ModalController,
    public favoriteProvider : FavoriteProvider){
     
    }

  ionViewDidLoad() {
    try{
      if(!this.UserInfo){
        
        this.favoriteProvider.getUserInfo().then(
          data => {
            console.log("userInfo from storage: " +JSON.stringify(data));
            if(data){
              this.UserInfo = JSON.parse(data);
              console.log(this.UserInfo)
              this.apiKey = this.UserInfo["userApi"] || " ";
              this.user = this.UserInfo["username"] ;
              this.techId = this.UserInfo["techId"];
              this.UserInfo = {username :  this.user , userApi :  this.apiKey  , techId :  this.techId };
            }
          }
        )
      }
     }
    catch(err){
      console.log('error: ' +JSON.stringify(err));
    }

  }

  SaveApi(apiKeyIn: string){
    this.apiKey = this.apiKey.trim();
    return new Promise((resolve, reject) => {
      this.http.get(apiBase + "GetTechInfo?api="+ apiKeyIn)
      .subscribe(res => {
        resolve(res);
        this.apiKey = apiKeyIn;
        this.user = res["parameters"][1]["value"];
        this.techId = res["parameters"][0]["value"];
        this.UserInfo = {username :  this.user  , userApi : apiKeyIn  , techId :  this.techId };
        this.favoriteProvider.insertUserInfo(JSON.stringify(this.UserInfo)).then(
          data => {
            console.log("userinfo inserted");
            this.navCtrl.setRoot(TabsPage);
          }
        )
      }, 
      (err) => {
        reject(err);
      });
    });


  }


  OpenDetail(id : string){
    const modalData : string = id
    const modalUser : {} = this.UserInfo;
    const detailModal = this.modal.create('WoDetailsPage',{data : modalData, UserInfo : modalUser});
    detailModal.present();
  }


  GetWorkorders(){
    this.GetWO();
  }

   //Post Data
   GetWO(){
    return new Promise((resolve, reject) => {
      this.http.get(apiBase + "GetOpenWorkorders?api=" +this.apiKey )
      .subscribe(res => {
        resolve(res);
        this.WorkOrders = res;
      }, 
      (err) => {
        reject(err);
      });
    });
  }

}
