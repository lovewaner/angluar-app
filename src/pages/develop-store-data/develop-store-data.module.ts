import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevelopStoreDataPage } from './develop-store-data';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    DevelopStoreDataPage,
  ],
  imports: [
    IonicPageModule.forChild(DevelopStoreDataPage),
    MultiPickerModule
  ],
})
export class DevelopStoreDataPageModule {}
