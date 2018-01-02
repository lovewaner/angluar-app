import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevelopStoreInformationPage } from './develop-store-information';

@NgModule({
  declarations: [
    DevelopStoreInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(DevelopStoreInformationPage),
  ],
})
export class DevelopStoreInformationPageModule {}
