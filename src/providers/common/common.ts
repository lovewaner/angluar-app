import { Injectable } from '@angular/core';
import {
  HttpClient,
} from "@angular/common/http";

/*
  Generated class for the CommonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommonProvider {

  constructor(public http: HttpClient) {
    console.log('Hello CommonProvider Provider');
  }

}
