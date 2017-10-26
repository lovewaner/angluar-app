import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunicationDoormanPage } from './communication-doorman';

@NgModule({
  declarations: [
    CommunicationDoormanPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunicationDoormanPage),
  ],
})
export class CommunicationDoormanPageModule {}
