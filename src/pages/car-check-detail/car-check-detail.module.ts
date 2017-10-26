import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarCheckDetailPage } from './car-check-detail';

@NgModule({
  declarations: [
    CarCheckDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CarCheckDetailPage),
  ],
})
export class CarCheckDetailPageModule {}
