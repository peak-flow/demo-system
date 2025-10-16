import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, filter, map } from 'rxjs/operators';
import { AdminService } from 'src/app/services/admin.service';
import { TestPatient } from 'src/app/classes/test-patient';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  public page = 1;
  public query = '';
  public patients: {
    count: number;
    list: { [page: number]: { [id: number]: TestPatient } };
  } = { count: 0, list: [] };
  public patientsLoading: boolean;
  protected patientQuery: BehaviorSubject<string> = new BehaviorSubject('');
  protected testPatients: TestPatient[];
  protected searchFilter: string;
  protected searchTextChanged = new Subject<string>();

  constructor(
    private admin: AdminService,
    private orders: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.patientQuery
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.patientsLoading = true)),
        tap(() => (this.page = 1)),
        switchMap(query => {
          this.query = query;
          return this.orders
            .search('testPatient', query, this.page)
            .pipe(tap(() => (this.patientsLoading = false)));
        })
      )
      .subscribe(patients => {
        this.patients.list[this.page] = patients.list;
        this.patients.count = patients.count;
      });

    this.route.queryParams
      .pipe(
        filter(params => params.uncache),
        map((params: any) => {
          const uncache = params.uncache;
          if (uncache) {
            this.orders.search('testPatient', this.query, this.page, true)
              .subscribe(patients => {
                this.patients.list[this.page] = patients.list;
                this.patients.count = patients.count;
                this.router.navigate([], { queryParams: {} });
              });
          }
        })
      )
      .subscribe(() => {});
  }

  searchTestPatients($event) {
    this.patientQuery.next($event.target.value);
  }

  changePage(page) {
    this.page = page;
    if (!this.patients.list[page]) {
      this.admin.searchAllPatients(this.query, page).subscribe(patients => {
        this.patients.list[this.page] = patients.list;
        this.patients.count = patients.count;
        console.log(patients);
      });
    }
  }
}
