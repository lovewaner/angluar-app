import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValuationStorePage } from './valuation-store';

@NgModule({
  declarations: [
    ValuationStorePage,
  ],
  imports: [
    IonicPageModule.forChild(ValuationStorePage),
  ],
})
export class ValuationStorePageModule {}
