import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinePage } from './mine';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    MinePage,
  ],
  imports: [
    IonicPageModule.forChild(MinePage),
    IonicImageViewerModule
  ],
})
export class MinePageModule {}
