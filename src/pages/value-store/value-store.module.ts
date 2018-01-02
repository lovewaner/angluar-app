import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValueStorePage } from './value-store';

@NgModule({
  declarations: [
    ValueStorePage,
  ],
  imports: [
    IonicPageModule.forChild(ValueStorePage),
  ],
})
export class ValueStorePageModule {}
