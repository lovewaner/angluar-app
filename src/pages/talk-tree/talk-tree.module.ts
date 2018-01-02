import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TalkTreePage } from './talk-tree';

@NgModule({
  declarations: [
    TalkTreePage,
  ],
  imports: [
    IonicPageModule.forChild(TalkTreePage),
  ],
})
export class TalkTreePageModule {}
