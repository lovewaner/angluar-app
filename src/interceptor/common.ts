import { Injectable } from "@angular/core";
import {
  HttpSentEvent,
  HttpHeaderResponse,
  HttpUserEvent,
  HttpProgressEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    return next.handle(request.clone());
  }
}
