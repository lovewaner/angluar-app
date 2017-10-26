import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinePage } from './mine';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    MinePage,
  ],
  imports: [
    IonicPageModule.forChild(MinePage),
    MultiPickerModule
  ],
})
export class MinePageModule {}
