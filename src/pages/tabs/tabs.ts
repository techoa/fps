import { Component } from '@angular/core';

import { DashboardPage } from '../dashboard/dashboard';
import { MapsPage } from '../maps/maps';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DashboardPage;
  tab2Root = MapsPage;
  constructor() {

  }
}
