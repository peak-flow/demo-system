import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, filter, map } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { OrderSet } from 'src/app/classes/order-set';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-sets',
  templateUrl: './order-sets.component.html',
  styleUrls: ['./order-sets.component.scss']
})
export class OrderSetsComponent implements OnInit {
  public page = 1;
  public query = '';
  public orderSets: {
    count: number;
    list: { [page: number]: { [id: number]: OrderSet } };
  } = { count: 0, list: [] };

  public orderSetsLoading: boolean;
  protected orderSetQuery: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private orders: OrderService,
    private admin: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.orderSetQuery
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.orderSetsLoading = true)),
        tap(() => (this.page = 1)),
        switchMap(query =>
          this.orders
            .searchOrderSets(query, this.page)
            .pipe(tap(() => (this.orderSetsLoading = false)))
        )
      )
      .subscribe(orderSets => {
        this.orderSets.list[this.page] = orderSets.list;
        this.orderSets.count = orderSets.count;
      });

    this.route.queryParams
      .pipe(
        filter(params => params.uncache),
        map((params: any) => {
          const uncache = params.uncache;
          if (uncache) {
            this.orders
              .search('orderSet', this.query, this.page, true)
              .subscribe(orderSets => {
                this.orderSets.list[this.page] = orderSets.list;
                this.orderSets.count = orderSets.count;
                this.router.navigate([], { queryParams: {} });
              });
          }
        })
      )
      .subscribe(() => {});
  }

  searchTestSet($event) {
    this.orderSetQuery.next($event.target.value);
  }

  changePage(page) {
    this.page = page;
    if (!this.orderSets.list[page]) {
      this.orders.searchOrderSets(this.query, page).subscribe(orderSets => {
        this.orderSets.list[this.page] = orderSets.list;
        this.orderSets.count = orderSets.count;
      });
    }
  }
}
