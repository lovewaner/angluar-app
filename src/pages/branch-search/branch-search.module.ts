import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BranchSearchPage } from './branch-search';

@NgModule({
  declarations: [
    BranchSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(BranchSearchPage),
  ],
})
export class BranchSearchPageModule {}
