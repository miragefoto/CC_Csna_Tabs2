
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpModule } from '@angular/http';

const STORAGE_KEY = 'scannedItems';
const USER_KEY = 'UserName';
const USER_INFO =  "UserInfo";
const USER_API = "UserApi";
const All_USER_LIST = "AllUserList";
 
@Injectable()
export class FavoriteProvider {
 
  constructor(
    public storage: Storage) { }
 
  insertScan(scan) {
    return this.getAllScans().then(result => {
      if (result) {
        result.push(scan);
        this.storage.set(STORAGE_KEY, result);
        return this.storage.get(STORAGE_KEY);
      } 
      else {
        this.storage.set(STORAGE_KEY, [scan]);
        return this.storage.get(STORAGE_KEY);
      }
    });
  }

  insertUserInfo(info){
    return this.storage.set(USER_INFO, info);
  }

  getUserInfo(){
    return this.storage.get(USER_INFO);
  }

  clearUserInfo(){
    this.storage.remove(USER_INFO);
    this.storage.set(USER_INFO, []);
    return this.storage.get(USER_INFO);
  }

  getAllScans() {
    return this.storage.get(STORAGE_KEY);
  }

  clearItem(){

  }

  clearMemory(){
    this.storage.remove(STORAGE_KEY);
    this.storage.set(STORAGE_KEY, []);
    return this.storage.get(STORAGE_KEY);
  }

  getUser() {
    return this.storage.get(USER_KEY);
  }

  insertUser(user) {
    this.storage.set(USER_KEY, user);
    return this.storage.get(USER_KEY);
  }

  insertAllUserList(allUsers){
    this.storage.set(All_USER_LIST, allUsers);
  }

  getAllUsersList() {
    return this.storage.get(All_USER_LIST);
  }
  


}