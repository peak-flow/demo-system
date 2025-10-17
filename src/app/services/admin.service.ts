import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { OrderSet, OrderTest, OrderPanel, OrderTdPanel, OrderResult } from '../classes/order-set';
import { Observable } from 'rxjs';
import { MedicationSet } from '../classes/medication';
import { TestPatient } from '../classes/test-patient';
import { Patient } from '../classes/patient';
import { ScheduledOrder } from '../classes/scheduled-order';
import { OrderQuery } from '../classes/order';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private api: ApiService) {}

  getOrderSet(orderSetId: number): Promise<OrderSet> {
    return this.api.get(`demo/orderSets/view/${orderSetId}`).toPromise();
  }

  searchTests(
    query: string,
    page: number
  ): Observable<{ count: number; list: OrderPanel[] }> {
    return this.api.post(`demo/search/tests/${page}`, query);
  }

  searchProfiles(
    query: string,
    page: number
  ): Observable<{ count: number; list: OrderPanel[] }> {
    return this.api.post(`demo/search/profiles/${page}`, query);
  }

  searchResults(
    query: string,
    page: number
  ): Observable<{ count: number; list: OrderResult[] }> {
    return this.api.post(`demo/search/results/${page}`, query);
  }

  searchTdTests(
    query: string,
    page: number
  ): Observable<{ count: number; list: OrderTdPanel[] }> {
    return this.api.post(`demo/search/tdTests/${page}`, query);
  }

  getProfileTests(testId: number): Promise<OrderTest[]> {
    return this.api.get(`demo/orderSets/getProfileTests/${testId}`).toPromise();
  }

  getResultTests(panels: OrderPanel[]): Promise<OrderResult[]> {
    return this.api.post('demo/orderSets/transformCopiaTests', panels).toPromise();
  }

  getOrderResults(hostCode: string): Promise<OrderResult[]> {
    return this.api.get(`demo/orderSets/getOrderResults/${hostCode}`).toPromise();
  }

  saveOrderSet(orderSet: OrderSet) {
    return this.api.post('demo/orderSets/savePanels', orderSet).toPromise();
  }

  deleteOrderSet(id: number) {
    return this.api.get(`demo/orderSets/delete/${id}`).toPromise();
  }

  saveMedSet(medSet: MedicationSet) {
    return this.api.post('demo/medSets/save', medSet).toPromise();
  }

  getMedSet(medSetId: number): Promise<MedicationSet> {
    return this.api.get(`demo/medSets/view/${medSetId}`).toPromise();
  }

  deleteMedSet(id: number) {
    return this.api.get(`demo/medSets/delete/${id}`).toPromise();
  }

  searchAllPatients(
    query: string,
    page: number
  ): Observable<{ count: number; list: TestPatient[] }> {
    return this.api.post(`demo/search/testPatients/${page}`, query);
  }

  searchPatients(patientId: number): Observable<TestPatient> {
    return this.api.get(`demo/testPatients/search/${patientId}`);
  }

  updatePatient(updatePatientInfo: TestPatient) {
    return this.api
      .post('demo/testPatients/edit', updatePatientInfo)
      .toPromise();
  }

  savePatient(newPatientInfo: TestPatient) {
    return this.api
      .post('demo/testPatients/create', newPatientInfo, true)
      .toPromise();
  }

  searchScheduledOrders(
    query: OrderQuery = null,
    page: number = 1,
    uncache: boolean = false
  ): Observable<{ count: number; list: ScheduledOrder[] }> {
    return this.api.post(
      `demo/scheduledOrders/search/${page}${uncache ? '?uncache=1' : ''}`,
      query
    );
  }

  loadScheduledOrder(scheduledOrderId: number): Promise<ScheduledOrder> {
    return this.api
      .get(`demo/scheduledOrders/view/${scheduledOrderId}`)
      .toPromise();
  }

  saveScheduledOrder(order: ScheduledOrder) {
    return this.api.post('demo/scheduledOrders/save', order).toPromise();
  }

  deleteScheduledOrder(id: number) {
    return this.api.get(`demo/scheduledOrders/delete/${id}`).toPromise();
  }
}
