import { Component, Pipe } from '@angular/core';
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
            if(data){
              this.UserInfo = JSON.parse(data);
              this.apiKey = this.UserInfo["userApi"] || " ";
              this.user = this.UserInfo["username"] ;
              this.techId = this.UserInfo["techId"];
              this.UserInfo = {username :  this.user , userApi :  this.apiKey  , techId :  this.techId };
              console.log(JSON.stringify(this.UserInfo));
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
    //Prod
   this.GetWO();

   /*
    //Dev
    this.WorkOrders = [{"WORKORDERID":"12418","DEPARTMENT":"N/A","baseInfo":[{"FieldName":"SUBJECT","FieldType":"string","Value":"Reduce button clicks to increase productivity"},{"FieldName":"REQUESTER","FieldType":"string","Value":"Sandra Swavely"},{"FieldName":"WORKORDERID","FieldType":"string","Value":"12418"},{"FieldName":"CREATEDBY","FieldType":"string","Value":"Eric Phillips"},{"FieldName":"Department","FieldType":"string","Value":"Indigent Defense"},{"FieldName":"Job Title","FieldType":"string","Value":"Administrative Assistant II"},{"FieldName":"Requestor Email","FieldType":"string","Value":"slswavely@chathamcounty.org"}]},{"WORKORDERID":"12418","DEPARTMENT":"ICS","baseInfo":[{"FieldName":"SUBJECT","FieldType":"string","Value":"Reduce button clicks to increase productivity"},{"FieldName":"REQUESTER","FieldType":"string","Value":"Sandra Swavely"},{"FieldName":"WORKORDERID","FieldType":"string","Value":"12624"},{"FieldName":"CREATEDBY","FieldType":"string","Value":"Travis Shuff"},{"FieldName":"Department","FieldType":"string","Value":"ICS"},{"FieldName":"Job Title","FieldType":"string","Value":"Da Boss"},{"FieldName":"Requestor Email","FieldType":"string","Value":"tshuff@chathamcounty.org"}]},{"WORKORDERID":"124418","DEPARTMENT":"ICS","baseInfo":[{"FieldName":"SUBJECT","FieldType":"string","Value":"Reduce button clicks to increase productivity"},{"FieldName":"REQUESTER","FieldType":"string","Value":"Sandra Swavely"},{"FieldName":"WORKORDERID","FieldType":"string","Value":"12624"},{"FieldName":"CREATEDBY","FieldType":"string","Value":"Travis Shuff"},{"FieldName":"Department","FieldType":"string","Value":"ICS"},{"FieldName":"Job Title","FieldType":"string","Value":"Da Boss"},{"FieldName":"Requestor Email","FieldType":"string","Value":"tshuff@chathamcounty.org"}]},{"WORKORDERID":"124128","DEPARTMENT":"JOMS","baseInfo":[{"FieldName":"SUBJECT","FieldType":"string","Value":"Reduce button clicks to increase productivity"},{"FieldName":"REQUESTER","FieldType":"string","Value":"Sandra Swavely"},{"FieldName":"WORKORDERID","FieldType":"string","Value":"12624"},{"FieldName":"CREATEDBY","FieldType":"string","Value":"Travis Shuff"},{"FieldName":"Department","FieldType":"string","Value":"ICS"},{"FieldName":"Job Title","FieldType":"string","Value":"Da Boss"},{"FieldName":"Requestor Email","FieldType":"string","Value":"tshuff@chathamcounty.org"}]},{"WORKORDERID":"123418","DEPARTMENT":"BOB","baseInfo":[{"FieldName":"SUBJECT","FieldType":"string","Value":"Reduce button clicks to increase productivity"},{"FieldName":"REQUESTER","FieldType":"string","Value":"Sandra Swavely"},{"FieldName":"WORKORDERID","FieldType":"string","Value":"12624"},{"FieldName":"CREATEDBY","FieldType":"string","Value":"Travis Shuff"},{"FieldName":"Department","FieldType":"string","Value":"ICS"},{"FieldName":"Job Title","FieldType":"string","Value":"Da Boss"},{"FieldName":"Requestor Email","FieldType":"string","Value":"tshuff@chathamcounty.org"}]}];
    //this.WorkOrders =  this.sortByProperty(this.WorkOrders,'DEPARTMENT')
    return this.WorkOrders;
    */
  }

   //Post Data
   GetWO(){
    return new Promise((resolve, reject) => {
      this.http.get(apiBase + "GetOpenWorkorders2?api=" +this.apiKey )
      .subscribe(res => {
        resolve(res);
        this.WorkOrders = res;
        //this.sortByProperty(this.WorkOrders,'DEPARTMENT')

      }, 
      (err) => {
        reject(err);
      });
    });
  }

  
  



  // END OF THE WORLD
}
