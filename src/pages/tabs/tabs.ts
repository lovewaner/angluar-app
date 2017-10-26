import { Component } from '@angular/core';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'TasksPage';
  tab2Root = 'MessagesPage';
  tab3Root = 'WorksPage';
  tab4Root = 'MinePage';

  constructor() {

  }
}
