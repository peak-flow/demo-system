import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderSet } from 'src/app/classes/order-set';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private orders: OrderService) { }

  ngOnInit() {
  }

}
