import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunicationManagerPage } from './communication-manager';

@NgModule({
  declarations: [
    CommunicationManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunicationManagerPage),
  ],
})
export class CommunicationManagerPageModule {}
