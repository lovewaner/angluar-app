import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointOrderPage } from './point-order';

@NgModule({
  declarations: [
    PointOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(PointOrderPage),
  ],
})
export class PointOrderPageModule {}
