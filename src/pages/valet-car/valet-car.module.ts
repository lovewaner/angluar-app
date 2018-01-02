import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValetCarPage } from './valet-car';

@NgModule({
  declarations: [
    ValetCarPage,
  ],
  imports: [
    IonicPageModule.forChild(ValetCarPage),
  ],
})
export class ValetCarPageModule {}
