import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgentCheckPage } from './agent-check';

@NgModule({
  declarations: [
    AgentCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(AgentCheckPage),
  ],
})
export class AgentCheckPageModule {}
