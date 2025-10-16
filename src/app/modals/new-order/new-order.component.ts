import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, take } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import { OrderPatient, OrderLocation, OrderDoctor, Order } from 'src/app/classes/order';
import { OrderSet } from 'src/app/classes/order-set';
import { MedicationSet } from 'src/app/classes/medication';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements AfterViewInit {
  @ViewChild('newOrderModal') modal;
  public order: Order = new Order();

  public searchInfo: {
    [name: string]: {
      query: Subject<string>;
      loading: boolean;
      list: any[];
      page: number;
      count: number;
    };
  } = {};

  public searches = ['location', 'doctor', 'patient', 'orderSet', 'medSet'];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private orders: OrderService
  ) {
    this.buildSearchInfo();
    this.watchSearches();
  }

  ngAfterViewInit() {
    window.setTimeout(() =>
      this.modalService
        .open(this.modal, { ariaLabelledBy: 'order-modal-title' })
        .result.then(
          result => {
            console.log('modal closed', result);
            this.router.navigate(['orders']);
          },
          reason => {
            console.log('modal dismissed', reason);
            this.router.navigate(['orders']);
          }
        )
    );
  }

  buildSearchInfo() {
    this.searches.forEach(name => {
      this.searchInfo[name] = {
        query: new BehaviorSubject(''),
        loading: false,
        list: [],
        page: 0,
        count: 0
      };
    });
  }

  scroll(name) {
    if (this.searchInfo[name].count === this.searchInfo[name].list.length) {
      return;
    }

    this.searchInfo[name].query
      .pipe(
        take(1),
        switchMap(query => this.orders.search(name, query, ++this.searchInfo[name].page))
      )
      .subscribe(
        profiles => this.searchInfo[name].list = this.searchInfo[name].list.concat(profiles.list)
      );
  }

  watchSearches() {
    for (const name in this.searchInfo) {
      if (this.searchInfo.hasOwnProperty(name)) {
        this.searchInfo[name].query
          .pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => (this.searchInfo[name].loading = true)),
            switchMap(query =>
              this.orders
                .search(name, query, (this.searchInfo[name].page = 1))
                .pipe(
                  tap(
                    thing => console.log(thing),
                    tap(() => (this.searchInfo[name].loading = false))
                  )
                )
            )
          )
          .subscribe(patients => {
            this.searchInfo[name].count = patients.count;
            this.searchInfo[name].list = patients.list;
          });
      }
    }
  }

  process() {
    return this.orders
      .createOrder(this.order)
      .then(orderId => {
        this.orders.fullProcess(orderId);
        return orderId;
      })
      .then(orderId => {
        this.modalService.dismissAll('order created');
        return orderId;
      })
      .then(orderId => this.router.navigate(['orders', 'view', orderId]));
  }

  create() {
    return this.orders
      .createOrder(this.order)
      .then(orderId => this.router.navigate(['orders', 'view', orderId]))
      .then(() => this.modalService.dismissAll('order created'));
  }
}
