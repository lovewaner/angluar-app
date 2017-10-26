import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunicationStationmasterPage } from './communication-stationmaster';

@NgModule({
  declarations: [
    CommunicationStationmasterPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunicationStationmasterPage),
  ],
})
export class CommunicationStationmasterPageModule {}
