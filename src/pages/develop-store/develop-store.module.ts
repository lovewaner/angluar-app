import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevelopStorePage } from './develop-store';

@NgModule({
  declarations: [
    DevelopStorePage,
  ],
  imports: [
    IonicPageModule.forChild(DevelopStorePage),
  ],
})
export class DevelopStorePageModule {}
