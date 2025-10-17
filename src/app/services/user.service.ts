import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { from } from 'rxjs';
import { merge, filter, take } from 'rxjs/operators';

import { MessageService } from './message.service';
import { ApiService } from './api.service';

@Injectable()
export class UserService {
  constructor(
    private api: ApiService,
    private message: MessageService
  ) {
    if (environment.env_name === 'development') {
      this.login(environment.user_name, environment.password);
    }
    this.watchInfo();
  }

  private _crmId: string;
  public info: any;
  login(username: string, password: string) {
    this.api.get(`user/token?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, true)
      .subscribe(bundle => {
        this.info = bundle.user_info;
        this.api.streamToken(bundle.token);
      });
  }

  watchInfo() {
    this.message.getMessages('user:info').subscribe(info => this.info = info);
  }

  waitForInfo() {
    return from([this.info]).pipe(
      filter(info => !!info),
      merge(this.message.getMessages('user:info')),
      take(1)
    );
  }

  prop(name: string) {
    return this.info && this.info[name];
  }

  set crmId(id: string) {
    if (id.match(/[A-Z0-9]{12}/)) {
      this._crmId = id;
      localStorage.setItem('crmId', id);
      this.api.get(`startup/save_crm/${id}`).subscribe(() => { });
    } else {
      console.error('Invalid CRM ID');
    }
  }

  get crmId() {
    return this._crmId || localStorage.getItem('crmId');
  }
}
