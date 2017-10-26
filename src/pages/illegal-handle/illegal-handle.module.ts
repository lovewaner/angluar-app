import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IllegalHandlePage } from './illegal-handle';

@NgModule({
  declarations: [
    IllegalHandlePage,
  ],
  imports: [
    IonicPageModule.forChild(IllegalHandlePage),
  ],
})
export class IllegalHandlePageModule {}
