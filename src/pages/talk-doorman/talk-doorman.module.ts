import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TalkDoormanPage } from './talk-doorman';

@NgModule({
  declarations: [
    TalkDoormanPage,
  ],
  imports: [
    IonicPageModule.forChild(TalkDoormanPage),
  ],
})
export class TalkDoormanPageModule {}
