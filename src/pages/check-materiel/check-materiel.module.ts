import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckMaterielPage } from './check-materiel';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    CheckMaterielPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckMaterielPage),
    MultiPickerModule
  ],
})
export class CheckMaterielPageModule {}
