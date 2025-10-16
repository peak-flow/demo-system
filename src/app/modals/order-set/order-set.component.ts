import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { OrderSet, OrderPanel, OrderTdPanel, OrderResult } from 'src/app/classes/order-set';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { AdminService } from 'src/app/services/admin.service';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, take } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-order-set',
  templateUrl: './order-set.component.html',
  styleUrls: ['./order-set.component.scss']
})
export class OrderSetComponent implements AfterViewInit {
  protected addingPanel: boolean;
  protected panelToAdd: OrderPanel;
  protected tdPanelToAdd: OrderTdPanel;
  protected resultToAdd: OrderResult;
  protected selectionOption:string = "profile";

  protected profileLoading: boolean;
  protected profileQuery: BehaviorSubject<string> = new BehaviorSubject('');
  protected profileList: OrderPanel[] = [];
  protected profileCount = 0;
  protected profilePage = 0;

  protected testLoading: boolean;
  protected testQuery: BehaviorSubject<string> = new BehaviorSubject('');
  protected testList: OrderPanel[] = [];
  protected testCount = 0;
  protected testPage = 0;

  protected tdTestLoading: boolean;
  protected tdTestQuery: BehaviorSubject<string> = new BehaviorSubject('');
  protected tdTestList: OrderTdPanel[] = [];
  protected tdTestCount = 0;
  protected tdTestPage = 0;

  protected resultLoading: boolean;
  protected resultQuery: BehaviorSubject<string> = new BehaviorSubject('');
  protected resultList: OrderResult[] = [];
  protected resultCount = 0;
  protected resultPage = 0;

  protected orderSetLoading = false;
  public orderSet: OrderSet = new OrderSet();

  @ViewChild('orderSetModal') modal;
  @ViewChild('addPanelModal') panelModal;
  panelModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private orders: OrderService,
    private admin: AdminService
  ) {
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => {
          const orderSetId = Number(params.get('orderSetId'));
          if (orderSetId) {
            this.orderSetLoading = true;
            this.admin.getOrderSet(orderSetId).then(orderSet => {
              this.orderSet = orderSet;
              this.orderSet.panels = Object.values(this.orderSet.panels);
              this.orderSet.tdPanels = Object.values(this.orderSet.tdPanels);
              this.orderSetLoading = false;
            });
          } else {
            this.orderSetLoading = false;
            return;
          }
        })
      )
      .subscribe(() => {});
    this.watchQueries();
  }

  ngAfterViewInit() {
    window.setTimeout(() =>
      this.modalService
        .open(this.modal, { ariaLabelledBy: 'order-modal-title' })
        .result.then(
          result => {
            console.log('modal closed', result);
            this.router.navigate(['admin', 'order-sets']);
          },
          reason => {
            console.log('modal dismissed', reason);
            this.router.navigate(['admin', 'order-sets'], {
              queryParams: { uncache: true }
            });
          }
        )
    );
  }

  watchQueries() {
    this.profileQuery
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.profileLoading = true)),
        switchMap(query =>
          this.admin
            .searchProfiles(query, (this.profilePage = 1))
            .pipe(
              tap(
                thing => console.log(thing),
                tap(() => (this.profileLoading = false))
              )
            )
        )
      )
      .subscribe(profiles => {
        this.profileList = profiles.list;
        this.profileCount = profiles.count;
      });
    this.testQuery
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.testLoading = true)),
        switchMap(query =>
          this.admin
            .searchTests(query, (this.testPage = 1))
            .pipe(
              tap(
                thing => console.log(thing),
                tap(() => (this.testLoading = false))
              )
            )
        )
      )
      .subscribe(tests => {
        this.testList = tests.list;
        this.testCount = tests.count;
      });

    this.resultQuery
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.resultLoading = true)),
        switchMap(query =>
          this.admin
            .searchResults(query, (this.resultPage = 1))
            .pipe(
              tap(
                thing => console.log(thing),
                tap(() => (this.resultLoading = false))
              )
            )
        )
      )
      .subscribe(results => {
        this.resultList = results.list;
        this.resultCount = results.count;
      });

    this.tdTestQuery
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.tdTestLoading = true)),
        switchMap(query =>
          this.admin
            .searchTdTests(query, (this.tdTestPage = 1))
            .pipe(
              tap(
                thing => console.log(thing),
                tap(() => (this.tdTestLoading = false))
              )
            )
        )
      )
      .subscribe(tdTests => {
        this.tdTestList = tdTests.list;
        this.tdTestCount = tdTests.count;
      });
  }

  scrollProfiles() {
    if (this.profileCount === this.profileList.length) {
      return;
    }
    this.profileQuery
      .pipe(
        take(1),
        switchMap(query => this.admin.searchProfiles(query, ++this.profilePage))
      )
      .subscribe(
        profiles => (this.profileList = this.profileList.concat(profiles.list))
      );
  }

  scrollTests() {
    if (this.testCount === this.testList.length) {
      return;
    }
    this.testQuery
      .pipe(
        take(1),
        switchMap(query => this.admin.searchTests(query, ++this.testPage))
      )
      .subscribe(tests => (this.testList = this.testList.concat(tests.list)));
  }

  scrollResults() {
    if (this.resultCount === this.resultList.length) {
      return;
    }
    this.resultQuery
      .pipe(
        take(1),
        switchMap(query => this.admin.searchResults(query, ++this.resultPage))
      )
      .subscribe(results => (this.resultList = this.resultList.concat(results.list)));
  }

  scrollTdTests() {
    if (this.tdTestCount === this.tdTestList.length) {
      return;
    }
    this.tdTestQuery
      .pipe(
        take(1),
        switchMap(query => this.admin.searchTests(query, ++this.tdTestPage))
      )
      .subscribe(tdTests => (this.tdTestList = this.testList.concat(tdTests.list)));
  }

  save() {
     if (!this.orderSet.name){
       alert("Please enter a name for the Order Set.");
     } else {
      this.admin
        .saveOrderSet(this.orderSet)
        .then(() => this.modalService.dismissAll('order created'));
     }
  }

  deleteOrderSet() {
    if (confirm('Are you sure you want to delete this test set?')) {
      this.admin
        .deleteOrderSet(this.orderSet.id)
        .then(() => this.modalService.dismissAll('order deleted'));
    }
  }

  updateOptions(){
    this.panelToAdd = undefined;
    this.tdPanelToAdd = undefined;
  }

  addProfileOrTest() {
    if (this.addingPanel && this.panelToAdd !== undefined) {
      this.orderSet.panels = this.orderSet.panels || [];
      for (let panel of this.orderSet.panels){
        if (panel.id == this.panelToAdd.id){
          alert("This profile/test is already selected for this order. Please add a new one.");
          this.panelToAdd = undefined;
          return;
        }
      }
      this.orderSet.panels.push(this.panelToAdd);
      this.admin.getResultTests(this.orderSet.panels).then(results => {
        this.orderSet.results = this.orderSet.results || [];
        results.forEach(result => {
          if (!this.orderSet.results.filter(orderResult => orderResult.id === result.id).length) {
            this.orderSet.results.push(result);
          }
        });
      }
      );
      this.panelToAdd = undefined;
      this.panelModalRef.close();
    } else if (this.addingPanel && this.tdPanelToAdd !== undefined) {
      this.orderSet.tdPanels = this.orderSet.tdPanels || [];
      for (let panel of this.orderSet.tdPanels){
        if (panel.id == this.tdPanelToAdd.id){
          alert("This profile/test is already selected for this order. Please add a new one.");
          this.tdPanelToAdd = undefined;
          return;
        }
      }

      this.admin.getOrderResults(this.tdPanelToAdd.id).then(results => {
        this.orderSet.results = this.orderSet.results || [];
        results.forEach(result => {
          if (!this.orderSet.results.filter(orderResult => orderResult.id === result.id).length) {
            this.orderSet.results.push(result);
          }
        });
      });

      this.orderSet.tdPanels.push(this.tdPanelToAdd);
      this.tdPanelToAdd = undefined;

      this.panelModalRef.close();
    }
  }

  addResult() {
    if (!this.addingPanel && this.resultToAdd !== undefined) {
      this.orderSet.panels = this.orderSet.panels || [];
      for (let result of this.orderSet.results){
        if (result.id == this.resultToAdd.id){
          alert("This result test is already selected for this order. Please add a new one.");
          this.resultToAdd = undefined;
          return;
        }
      }
      this.orderSet.results.push(this.resultToAdd);
      this.resultToAdd = undefined;
      this.panelModalRef.close();
      this.addingPanel = false;
    } 
  }

  deletePanel(panelIndex) {
    this.admin.getResultTests([this.orderSet.panels[panelIndex]]).then(results =>
      {
        let tests = results.map(result => {
          return result.id;
        });
        this.orderSet.results = this.orderSet.results.filter((result) => {
          if(!tests.includes(result.id)){
            return result;
          }
        });
      });
      this.orderSet.panels.splice(panelIndex, 1);
  }

  deleteTdPanel(panelIndex) {
    this.orderSet.tdPanels.splice(panelIndex, 1);
  }

  deleteResult(resultIndex) {
    this.orderSet.results.splice(resultIndex, 1);
  }

  choosePanel() {
    this.addingPanel = true;
    this.panelModalRef = this.modalService.open(this.panelModal, {
      ariaLabelledBy: 'panel-modal-title'
    });
  }

  chooseResult() {
    this.addingPanel = false;
    this.panelModalRef = this.modalService.open(this.panelModal, {
      ariaLabelledBy: 'panel-modal-title'
    });
  }
}
