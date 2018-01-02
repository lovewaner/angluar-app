import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TalkManagerPage } from './talk-manager';

@NgModule({
  declarations: [
    TalkManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(TalkManagerPage),
  ],
})
export class TalkManagerPageModule {}
