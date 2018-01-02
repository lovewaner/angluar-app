import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskPage } from './task';
import { CalendarModule } from 'ion2-calendar';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    TaskPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskPage),
    CalendarModule,
    PipesModule
  ],
})
export class TaskPageModule {}
