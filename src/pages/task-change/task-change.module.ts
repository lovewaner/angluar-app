import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskChangePage } from './task-change';

@NgModule({
  declarations: [
    TaskChangePage,
  ],
  imports: [
    IonicPageModule.forChild(TaskChangePage),
  ],
})
export class TaskChangePageModule {}
