import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckCarPage } from './check-car';

@NgModule({
  declarations: [
    CheckCarPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckCarPage),
  ],
})
export class CheckCarPageModule {}
