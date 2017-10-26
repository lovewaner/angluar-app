import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainActivityPage } from './train-activity';

@NgModule({
  declarations: [
    TrainActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(TrainActivityPage),
  ],
})
export class TrainActivityPageModule {}
