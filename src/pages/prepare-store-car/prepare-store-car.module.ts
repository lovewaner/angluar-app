import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MultiPickerModule } from 'ion-multi-picker';
import { PrepareStoreCarPage } from './prepare-store-car';

@NgModule({
  declarations: [
    PrepareStoreCarPage,
  ],
  imports: [
    IonicPageModule.forChild(PrepareStoreCarPage),
    MultiPickerModule
  ],
})
export class PrepareStoreCarPageModule {}
