import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WoDetailsPage } from './wo-details';

@NgModule({
  declarations: [
    WoDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(WoDetailsPage),
  ],
})
export class WoDetailsPageModule {}
