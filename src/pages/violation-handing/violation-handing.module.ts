import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViolationHandingPage } from './violation-handing';

@NgModule({
  declarations: [
    ViolationHandingPage,
  ],
  imports: [
    IonicPageModule.forChild(ViolationHandingPage),
  ],
})
export class ViolationHandingPageModule {}
