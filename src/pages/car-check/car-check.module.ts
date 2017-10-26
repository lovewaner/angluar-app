import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarCheckPage } from './car-check';

@NgModule({
  declarations: [
    CarCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(CarCheckPage),
  ],
})
export class CarCheckPageModule {}
