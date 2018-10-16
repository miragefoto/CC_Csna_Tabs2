import { Component } from '@angular/core';

import { LookupPage } from '../lookup/lookup';
import { ScanPage } from '../scan/scan';
import { HomePage } from '../home/home';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root  = HomePage;
  tab2Root  = LookupPage;
  tab3Root  = ScanPage;
 

  constructor() {
    
  }
}
