import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { OrderQuery, DateQuery } from 'src/app/classes/order';
import { Subject, Subscription } from 'rxjs';
import { NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, mergeMap, filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public page = 1;
  public query: OrderQuery = { searchBy: 'id', term: null, exactMatch: false };
  protected dateQuery: DateQuery = { fromDate: null, toDate: null };
  protected fromDate: NgbDate;
  protected toDate: NgbDate;
  protected searchTextChanged = new Subject<string>();
  protected searchSubscription: Subscription;

  constructor(
    public orders: OrderService,
    public dateParser: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchSubscription = this.searchTextChanged
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        mergeMap(() => this.orders.searchThroughOrders(this.query))
      )
      .subscribe(() => {});

    if (!this.orders.orders.list[this.page]) {
      this.orders.getOrders(this.query, this.page);
    }
    this.route.queryParams
      .pipe(
        filter(params => params.uncache),
        map((params: any) => {
          const uncache = params.uncache;
          if (uncache) {
            this.orders
              .getOrders(this.query, this.page, true)
              .then(() => this.router.navigate([], { queryParams: {} }));
          }
        })
      )
      .subscribe(() => {});
  }

  searchOrders($event) {
    this.query.exactMatch = false;
    this.searchTextChanged.next($event.target.value);
  }

  selectOrders($event) {
    this.query.exactMatch = true;
    this.searchTextChanged.next($event.target.value);
  }

  searchOptions() {
    this.query.exactMatch = false;
    this.query.term = '';
  }

  checkDate(page) {
    if (this.fromDate && this.toDate) {
      this.dateQuery.fromDate = this.dateParser.format(this.fromDate);
      this.dateQuery.toDate = this.dateParser.format(this.toDate);
      if (this.dateQuery.fromDate > this.dateQuery.toDate) {
        alert('First date must be prior to second date.');
      } else {
        this.orders.searchDate(this.dateQuery, page);
      }
    } else {
      alert('Please enter value for both fields');
    }
  }

  time(time) {
    return time && moment(time).format('MM/DD/YYYY h:mm A');
  }

  changePage(page) {
    this.orders.getOrders(this.query, page);
  }
}
