import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainTreePage } from './train-tree';

@NgModule({
  declarations: [
    TrainTreePage,
  ],
  imports: [
    IonicPageModule.forChild(TrainTreePage),
  ],
})
export class TrainTreePageModule {}
