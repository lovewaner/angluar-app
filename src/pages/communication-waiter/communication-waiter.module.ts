import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunicationWaiterPage } from './communication-waiter';

@NgModule({
  declarations: [
    CommunicationWaiterPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunicationWaiterPage),
  ],
})
export class CommunicationWaiterPageModule {}
