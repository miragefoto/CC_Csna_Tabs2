import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
//Add storage access
import { FavoriteProvider } from './../../providers/favorite/favorite';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const apiUrlSingle = "http://servicedeskfeeds.chathamcounty.org/servicedeskoutsidefeed.asmx/GetOpenWorkordersJson";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user: string;
  public WorkOrders: any;



  constructor(
    public navCtrl: NavController,
    public http : HttpClient,
    public modal: ModalController,
    public favoriteProvider : FavoriteProvider){}

  
  ionViewDidLoad() {
    try{
      if(this.user == null || this.user == ""){
        this.favoriteProvider.getUser().then(
          name => {
            this.user = name;
          }
        ) 
      }
     }
    catch(err){
    }
  }



  OpenDetail(id : string){
    const modalData : string = id
    console.log("test: " + modalData );
    const detailModal = this.modal.create('WoDetailsPage',{data : modalData});
    detailModal.present();
  }


  GetWorkorders(){
    this.GetWO();
  }

   //Post Data
   GetWO(){
    return new Promise((resolve, reject) => {
      this.http.get(apiUrlSingle)
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
