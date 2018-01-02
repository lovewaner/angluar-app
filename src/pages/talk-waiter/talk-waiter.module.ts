import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TalkWaiterPage } from './talk-waiter';

@NgModule({
  declarations: [
    TalkWaiterPage,
  ],
  imports: [
    IonicPageModule.forChild(TalkWaiterPage),
  ],
})
export class TalkWaiterPageModule {}
