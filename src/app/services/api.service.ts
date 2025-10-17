import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';

import { of, BehaviorSubject, Observable } from 'rxjs';
import { filter, take, switchMap, catchError, map } from 'rxjs/operators';


import { MessageService } from './message.service';

@Injectable()
export class ApiService {
  /** the url for the api */
  private api_url = environment.api_url;

  constructor(
    private http: Http,
    private message: MessageService
  ) {
    this.streamToken();
  }

  /* token management */

  private tokenStream: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  streamToken(token = null) {
    if (token) {
      this.tokenStream.next(token);
    } else {
      this.message.getMessages('api:token').subscribe(apiToken => {
        this.tokenStream.next(apiToken);
      });
    }
  }

  get token() {
    return this.tokenStream.pipe(filter(token => token !== null), take(1));
  }

  /* http requests */

  options(token, blob?: boolean): RequestOptions {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return new RequestOptions({
      headers: new Headers(headers),
      responseType: blob ? ResponseContentType.Blob : ResponseContentType.Json
    });
  }

  post(path: string, data: any, json: boolean = true): Observable<any> {
    let postData;
    if (!json && typeof data === 'object') {
      postData = new URLSearchParams();
      Object.keys(data).forEach(key => {
        // console.log(key, data[key]);
        postData.set(key, data[key]);
      });
    } else {
      postData = data;
    }
    // console.log('postdata', postData);
    return this.token.pipe(switchMap(token =>
      this.http
        .post(this.api_url + path, postData, this.options(token))
        .pipe(map(this.processResponse),
             catchError(this.handleError))
    ));
  }

  get(path: string, noauth?: boolean, blob?: boolean): Observable<any> {
    const token = noauth ? of(null) : this.token;
    return token.pipe(switchMap(apiToken =>
      this.http
        .get(this.api_url + path, this.options(apiToken, blob))
        .pipe(map(this.processResponse),
              catchError(this.handleError))
    ));
  }

  /* response handling */

  processResponse(response: Response) {
    // Process responses that involve files
    if (response.headers.get('Content-Type') !== 'application/json') {
      const blob = new Blob([response.blob()], {
        type: response.headers.get('Content-Type')
      });
      return blob;
    }

    // Process JSON responses
    const json = response.json();

    if (!json.success) {
      throw new Error(json.error);
    }

    return json.data;
  }

  handleError(error: Response | any) {
    let errorMessage: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errorMessage = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errorMessage = error.message ? error.message : error.toString();
    }

    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
}
