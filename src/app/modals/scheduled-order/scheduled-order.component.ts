import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ScheduledOrder } from 'src/app/classes/scheduled-order';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, take } from 'rxjs/operators';
import { OrderPatient, OrderDoctor, OrderLocation } from 'src/app/classes/order';
import { OrderSet } from 'src/app/classes/order-set';
import { MedicationSet } from 'src/app/classes/medication';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import * as moment from 'moment';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-scheduled-order',
  templateUrl: './scheduled-order.component.html',
  styleUrls: ['./scheduled-order.component.scss']
})
export class ScheduledOrderComponent implements AfterViewInit {
  @ViewChild('newScheduledOrderModal') modal;
  public order: ScheduledOrder = new ScheduledOrder();
  protected scheduledOrdersLoading = false;

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
    private route: ActivatedRoute,
    private orders: OrderService,
    private admin: AdminService
  ) {
    this.buildSearchInfo();
    this.watchSearches();
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => {
          const scheduledOrderId = Number(params.get('scheduledOrderId'));
          if (scheduledOrderId) {
            this.scheduledOrdersLoading = true;
            this.admin.loadScheduledOrder(scheduledOrderId).then(order => {
              this.order = order;
              this.scheduledOrdersLoading = false;
            });
          } else {
            this.scheduledOrdersLoading = false;
            this.order = new ScheduledOrder();
          }
        })
      )
      .subscribe(() => {});
  }

  get hours(): number[] {
    const hours = [];
    for (let h = 0; h < 24; h++) {
      hours.push(
        moment()
          .hour(h)
          .format('h:00 A')
      );
    }

    return hours;
  }

  get days(): string[] {
    const days = [];
    for (let d = 0; d < 7; d++) {
      days.push(
        moment()
          .day(d)
          .format('dddd')
      );
    }

    return days;
  }

  get dates(): number[] {
    const dates = [];
    for (let d = 1; d <= 28; d++) {
      dates.push(d);
    }

    return dates;
  }

  ngAfterViewInit() {
    window.setTimeout(() =>
      this.modalService
        .open(this.modal, { ariaLabelledBy: 'order-modal-title' })
        .result.then(
          result => {
            console.log('modal closed', result);
            this.router.navigate(['admin', 'recurring']);
          },
          reason => {
            console.log('modal dismissed', reason);
            this.router.navigate(['admin', 'recurring'], {queryParams: {uncache: true}});
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
        switchMap(query =>
          this.orders.search(name, query, ++this.searchInfo[name].page)
        )
      )
      .subscribe(
        profiles =>
          (this.searchInfo[name].list = this.searchInfo[name].list.concat(
            profiles.list
          ))
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

  save() {
    this.admin
      .saveScheduledOrder(this.order)
      .then(() => this.modalService.dismissAll('order saved'));
  }

  delete() {
    this.admin
      .deleteScheduledOrder(this.order.id)
      .then(() => this.modalService.dismissAll('order deleted'));
  }
}
