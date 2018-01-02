import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrepareStorePage } from './prepare-store';

@NgModule({
  declarations: [
    PrepareStorePage,
  ],
  imports: [
    IonicPageModule.forChild(PrepareStorePage),
  ],
})
export class PrepareStorePageModule {}
