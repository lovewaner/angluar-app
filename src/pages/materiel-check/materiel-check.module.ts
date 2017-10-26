import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaterielCheckPage } from './materiel-check';

@NgModule({
  declarations: [
    MaterielCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(MaterielCheckPage),
  ],
})
export class MaterielCheckPageModule {}
