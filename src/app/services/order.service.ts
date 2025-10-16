import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { OrderPatient, OrderDoctor, OrderLocation, Order, OrderQuery, OrderEvent, DateQuery, MissingResult, OrderResult } from '../classes/order';
import { Observable } from 'rxjs';
import { MedicationSource, Medication, MedicationType, MedicationSet } from '../classes/medication';
import { OrderTest, OrderProfile, OrderSet, OrderPanel } from '../classes/order-set';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public orders: {
    count: number;
    list: { [page: number]: { [id: number]: Order } };
  } = { count: 0, list: [] };
  public events: { id: number; name: string }[] = [];
  public ordersLoading: boolean;
  public page: number;
  private query: OrderQuery;

  constructor(private api: ApiService) {}

   public getOrders(query: OrderQuery = null, page = 1, uncache = false): Promise<boolean> {
      this.ordersLoading = true;
      this.page = page;
      return new Promise((resolve, reject) => {
          this.searchOrders(query, page, uncache).subscribe(orders => {
            this.orders.list[page] = orders.list;
            this.orders.count = orders.count;
            resolve(this.ordersLoading = false);
          });
      });
  }

  public searchThroughOrders(query: OrderQuery = null, page = 1): Promise<boolean> {
    this.ordersLoading = true;
    this.query = query;
    this.page = page;
    return new Promise((resolve, reject) => {
        this.searchOrders(query, page).subscribe(orders => {
          this.orders.list[page] = orders.list;
          this.orders.count = orders.count;
          resolve(this.ordersLoading = false);
        });
    });
}

  getOrder(orderId): Promise<Order> {
    return new Promise((resolve, reject) => {
      const cachedOrder = this.getCachedOrder(orderId);
      if (cachedOrder) {
        return resolve(cachedOrder);
      }

      this.api
        .get(`demo/order/view/${orderId}`)
        .subscribe(order => resolve(order as Order));
    });
  }

  getCachedOrder(orderId: number): Order {
    for (const page of Object.values(this.orders.list)) {
      for (const order of Object.values(page)) {
        if (order.id == orderId) {
          return order;
        }
      }
    }
  }

  updateCachedOrder(order: Order): boolean {
    let updated = false;
    for (const pageKey of Object.keys(this.orders.list)) {
      const page = this.orders.list[pageKey];
      for (const orderKey of Object.keys(page)) {
        if (page[orderKey].id == order.id) {
          page[orderKey] = order;
          updated = true;
        }
      }
    }

    return updated;
  }

  ordersCount(): number {
    return this.orders.count;
  }

  ordersPage(page): Order[] {
    if (!this.orders.list[page]) {

    }
    return (
      this.orders.list[page] &&
      Object.values(this.orders.list[page]).sort((a, b) =>
        a.id > b.id ? -1 : a.id < b.id ? 1 : 0
      )
    );
  }

  public searchDate(dateQuery: DateQuery = null, page = 1): Promise<boolean> {
    this.ordersLoading = true;
    this.page = page;
    return new Promise((resolve, reject) => {
      this.searchDateRange(dateQuery, page).subscribe(orders => {
        this.orders.list[page] = orders.list;
        this.orders.count = orders.count;
        resolve(this.ordersLoading = false);
      });
    });
  }

  searchDateRange(dateQuery: DateQuery, page: number = 1): Observable<{count: number, list: Order[]}>  {
    return this.api.post(`demo/order/searchDateRange/${page}`, dateQuery);
  }

  public search(name: string, query: string, page: number = 1, uncache: boolean = false): Observable<{count: number, list: any[]}> {
    let url = `demo/search/${name}s/${page}`;
    if (uncache) {
      url += '?uncache=1';
    }
    return this.api.post(url, query);
  }

  public searchOrders(query: OrderQuery = null, page: number = 1, uncache: boolean = false): Observable<{count: number, list: Order[]}> {
    let url = `demo/order/search/${page}`;
    if (uncache) {
      url += '?uncache=1';
    }
    return this.api.post(url, query);
  }

  public searchPatients(query: string, page: number = 1): Observable<{count: number, list: OrderPatient[]}> {
    return this.api.post(`demo/search/patients/${page}`, query);
  }

  public searchDoctors(query: string, page: number = 1): Observable<{count: number, list: OrderDoctor[]}> {
    return this.api.post(`demo/search/doctors/${page}`, query);
  }

  public searchLocations(query: string, page: number = 1): Observable<{count: number, list: OrderLocation[]}> {
    return this.api.post(`demo/search/locations/${page}`, query);
  }

  public searchOrderSets(query: string, page: number = 1): Observable<{count: number, list: OrderSet[]}> {
    return this.api.post(`demo/search/orderSets/${page}`, query);
  }

  public getOrderEvents(order: Order): Promise<boolean> {
    return this.api
      .get(`demo/order/events/${order.id}`)
      .toPromise()
      .then((events: OrderEvent[]) => {
        const lastEventIdx = events.filter(event => event.time).length - 1;
        order.events = events;
        order.status = order.events[lastEventIdx];
        return true;
      });
  }

  public updateOrder(order: Order): Promise<Order> {
    return this.api
      .get(`demo/order/update/${order.id}`)
      .toPromise()
      .then((info: { summary: Order; events: OrderEvent[],
                     results: {received: OrderResult[], missing: MissingResult[], validation: OrderResult[] },
                     orders: OrderPanel[]}) => {
        const lastEventIdx = info.events.filter(event => event.time).length - 1;
        info.summary.medSet = order.medSet;
        info.summary.orderSet = order.orderSet;
        info.summary.missing = order.missing;

        order = info.summary;
        order.events = info.events;
        order.status = info.events[lastEventIdx];
        if (!order.missing || order.missing.length !== info.results.missing.length) {
          order.missing = info.results.missing; // only update on change so values don't get wiped
        }
        order.validation = info.results.validation;
        order.received = info.results.received;
        order.orders = info.orders;
        console.log(order);
        this.updateCachedOrder(order);
        return order;
      });
  }

  public getOrderMeds(order: Order): Promise<boolean> {
    return this.api
      .get(`demo/order/meds/${order.id}`)
      .toPromise()
      .then((medSet: MedicationSet) => Boolean(order.medSet = medSet));
  }

  public getOrderTests(order: Order): Promise<boolean> {
    return this.api
      .get(`demo/order/tests/${order.orderSet.id}`)
      .toPromise()
      .then((tests: OrderPanel[]) => {
        order.orderSet.panels = tests;
        return true;
      });
  }

  public createOrder(order: Order): Promise<number> {
    const orderInfo = {
      location_id: order.location.id,
      doctor_id: order.doctor.id,
      patient_id: order.patient.id,
      order_set_id: order.orderSet.id,
      med_set_id: order.medSet.id
    };

    return this.api
      .post('demo/actions/create', orderInfo)
      .toPromise()
      .then(orderId => {
        this.getOrders(this.query, this.page, true);
        return orderId;
      });
  }

  public orderAction(actionId: number, order: Order) {}

  public sendOrderToCopia(orderId: number): Promise<boolean> {
    return this.api
      .get(`demo/actions/sendToCopia/${orderId}`)
      .toPromise()
      .then(success => {
        if (success) {
          console.log('order sent to copia');
        } else {
          console.error('order not sent to copia');
        }

        return success;
      });
  }

  public sendOrderToLIS(orderId: number): Promise<boolean> {
    return this.api
      .get(`demo/actions/release/${orderId}`)
      .toPromise()
      .then(success => {
        if (success) {
          console.log('order sent to lis');
        } else {
          console.error('order not sent to lis');
        }

        return success;
      });
  }

  public sendResultsToLIS(orderId: number): Promise<boolean> {
    return this.api
      .get(`demo/actions/result/${orderId}`)
      .toPromise()
      .then(success => {
        if (success) {
          console.log('results sent to lis');
        } else {
          console.error('results not sent to lis');
        }

        return success;
      });
  }

  public printReport(accessionId: number): Promise<boolean> {
    return this.api
      .get(`accession/dupe/${accessionId}/10`)
      .toPromise()
      .then(success => {
        if (success) {
          console.log('report duped');
        } else {
          console.error('report not duped');
        }

        return success;
      });
  }

  public sendMedications(orderId: number) {
    return this.api
      .get(`demo/actions/sendMeds/${orderId}`)
      .toPromise()
      .then(success => {
        if (success) {
          console.log('medications sent');
        } else {
          console.error('medications not sent');
        }

        return success;
      });
  }

  public saveMedications(
    orderId: number,
    rx: Medication[],
    sr: Medication[],
    prn: Medication[]
  ): Promise<boolean> {
    const meds = rx
      .map(med => {
        med.source = MedicationSource.Prescription;
        return med;
      })
      .concat(
        sr.map(med => {
          med.source = MedicationSource.SelfReported;
          return med;
        })
      )
      .concat(
        prn.map(med => {
          med.source = MedicationSource.PrescriptionPRN;
          return med;
        })
      );

    return this.api.post(`demo/actions/saveMeds/${orderId}`, meds).toPromise();
  }

  searchMedSets(query: string, page: number = 1, uncache: boolean = false): Observable<{count: number, list: MedicationSet[]}> {
    return this.api.post(`demo/search/medSets/${page}`, query);
  }

  public fullProcess(orderId: number) {
    return this.api.get(`demo/process/${orderId}`).toPromise();
  }

  public submitMissingResults(order: Order, saveToSet) {
    return this.api.post(`demo/actions/result/${order.id}` + (saveToSet ? '/1' : ''),
    order.missing.map((test: any) => { test.host_code = test.code; return test; }));
  }

  updateOrderStatus(orderId): any {
    this.api.get(`demo/order/load_status/${orderId}`)
      .subscribe(() => {});
  }
}
