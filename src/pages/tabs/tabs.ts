import { Component } from '@angular/core';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'TaskPage';
  tab2Root = 'MessagePage';
  tab3Root = 'WorkPage';
  tab4Root = 'MinePage';

  constructor() {

  }
}
