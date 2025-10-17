import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Message } from '../classes/message';

@Injectable()
export class MessageService {
  inbox = new Subject<Message>();
  outbox = new Subject<Message>();

  takeMessage(message: Message) {
    this.inbox.next(message);
    console.log('app receiving', message);
  }

  sendMessage(type: string, data?: any) {
    const message = new Message(type, data);
    this.outbox.next(message);
    console.log('app sending', message);
  }

  getMessages(messageType: string): Observable<any> {
    return this.inbox.pipe(
      filter(message => message.type === messageType),
      map(message => message.data));
  }
}
