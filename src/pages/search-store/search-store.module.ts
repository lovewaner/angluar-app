import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchStorePage } from './search-store';

@NgModule({
  declarations: [
    SearchStorePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchStorePage),
  ],
})
export class SearchStorePageModule {}
