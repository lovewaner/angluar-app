import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProblemHandlePage } from './problem-handle';

@NgModule({
  declarations: [
    ProblemHandlePage,
  ],
  imports: [
    IonicPageModule.forChild(ProblemHandlePage),
  ],
})
export class ProblemHandlePageModule {}
