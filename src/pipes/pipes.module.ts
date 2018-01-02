import { NgModule } from '@angular/core';
import { TimeagoPipe } from './timeago/timeago';
import { CommonModule } from "@angular/common";
@NgModule({
	declarations: [TimeagoPipe],
	imports: [CommonModule],
	exports: [TimeagoPipe]
})
export class PipesModule {}
