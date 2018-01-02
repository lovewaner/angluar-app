import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckCarDetailPage } from './check-car-detail';

@NgModule({
  declarations: [
    CheckCarDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckCarDetailPage),
  ],
})
export class CheckCarDetailPageModule {}
