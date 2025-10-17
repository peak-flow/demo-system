import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from '../../services/message.service';
import { Message } from '../../classes/message';
import { debounceTime } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navigator',
  template: `<iframe id="navigator">hi</iframe>`,
  styleUrls: ['./navigator.component.css'],
})
export class NavigatorComponent implements OnInit {
  constructor(
    private router: Router,
    private message: MessageService,
    private user: UserService
  ) { }

  ngOnInit() {
    this.watchOutbox();
    this.watchLocation();
    // this.watchHeight();
    this.sendLoading();
  }

  // listen for messages from navigator
  @HostListener('window:message', ['$event'])
  onMessage(event) {
    if (event.origin === window.location.origin) {
      this.message.takeMessage(event.data);
    }
  }

  // send height after resize
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.sendHeight();
  }

  /* monitor content attributes */
  watchHeight() { // TODO: IMPROVE ME
    const observer = new MutationObserver(mutations => this.sendHeight());
    const config = { childList: true, subtree: true, attributes: true };
    observer.observe(document.body, config);
  }

  watchLocation() {
    this.router.events.pipe(debounceTime(100)).subscribe(() => this.sendLocation());
  }

  watchOutbox() {
    this.message.outbox.subscribe(message => this.sendMessage(message));
  }

  /* send info to navigator */
  sendMessage(message: Message) {
    parent.postMessage(message, '*');
  }

  sendHeight() {
    const height = document.querySelector('body').scrollHeight;
    this.message.sendMessage('content:height', height);
  }

  sendLocation() {
    const location = window.location.pathname;
    this.message.sendMessage('content:location', location);
  }

  sendLoading() {
    this.message.sendMessage('content:loading');
  }
}
