import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TalkStationmasterPage } from './talk-stationmaster';

@NgModule({
  declarations: [
    TalkStationmasterPage,
  ],
  imports: [
    IonicPageModule.forChild(TalkStationmasterPage),
  ],
})
export class TalkStationmasterPageModule {}
