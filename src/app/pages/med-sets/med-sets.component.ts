import { Component, OnInit } from '@angular/core';
import { MedicationSet } from 'src/app/classes/medication';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, filter } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import { AdminService } from 'src/app/services/admin.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-med-sets',
  templateUrl: './med-sets.component.html',
  styleUrls: ['./med-sets.component.scss']
})
export class MedSetsComponent implements OnInit {
  public page = 1;
  public query = '';
  public medSets: {
    count: number;
    list: { [page: number]: { [id: number]: MedicationSet } };
  } = { count: 0, list: [] };

  public medSetsLoading: boolean;
  protected medSetQuery: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private orders: OrderService,
              private admin: AdminService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.medSetQuery
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.medSetsLoading = true)),
        tap(() => (this.page = 1)),
        tap(query => (this.query = query)),
        switchMap(query =>
          this.orders
            .search('medSet', query, this.page)
            .pipe(tap(() => (this.medSetsLoading = false)))
        )
      )
      .subscribe(medSets => {
        this.medSets.list[this.page] = medSets.list;
        this.medSets.count = medSets.count;
      });

    this.route.queryParams
      .pipe(
        filter(params => params.uncache),
        map((params: any) => {
          const uncache = params.uncache;
          if (uncache) {
            this.orders
              .search('medSet', this.query, this.page, true)
              .subscribe(medSets => {
                this.medSets.list[this.page] = medSets.list;
                this.medSets.count = medSets.count;
                this.router.navigate([], {queryParams: {}});
              });
          }
        })
      )
      .subscribe(() => {});
  }

  searchMedSet($event) {
    this.medSetQuery.next($event.target.value);
  }

  changePage(page) {
    this.page = page;
    if (!this.medSets.list[page]) {
      this.orders.search('medSet', this.query, page).subscribe(medSets => {
        this.medSets.list[this.page] = medSets.list;
        this.medSets.count = medSets.count;
      });
    }
  }
}
