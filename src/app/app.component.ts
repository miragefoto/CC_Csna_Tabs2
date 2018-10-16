import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FavoriteProvider } from './../providers/favorite/favorite';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  public UserInfo : {};

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public favoriteProvider : FavoriteProvider) {
     
      try{
        if(!this.UserInfo){
          this.favoriteProvider.getUserInfo().then(
            data => {
              if(data){
                console.log(data);
                this.UserInfo = JSON.parse(data);
                if(!this.UserInfo){
                  this.rootPage = HomePage;
                }
                else{
                  this.rootPage = TabsPage;
                }
              }
            }
          )
        }
       }
      catch(err){}
       console.log(this.UserInfo);
      if(!this.UserInfo){
        this.rootPage = HomePage;
      }
      else{
        this.rootPage = TabsPage;
      }
      

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    
  }
}
