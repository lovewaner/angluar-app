import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TasksHandlePage } from './tasks-handle';

@NgModule({
  declarations: [
    TasksHandlePage,
  ],
  imports: [
    IonicPageModule.forChild(TasksHandlePage),
  ],
})
export class TasksHandlePageModule {}
