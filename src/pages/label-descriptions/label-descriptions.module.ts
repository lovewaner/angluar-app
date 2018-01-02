import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LabelDescriptionsPage } from './label-descriptions';

@NgModule({
  declarations: [
    LabelDescriptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(LabelDescriptionsPage),
  ],
})
export class LabelDescriptionsPageModule {}
