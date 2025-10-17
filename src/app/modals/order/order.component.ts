import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/classes/order';
import { MedicationService } from 'src/app/services/medication.service';
import { MedicationChoiceTemplate, MedicationSource, Medication } from 'src/app/classes/medication';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements AfterViewInit {
  @ViewChild('orderModal') modal;
  protected orderLoading = false;
  submittedMissing = false;
  public order: Order;
  cardRXMeds: any[];
  cardSRMeds: any[];
  sammMeds: any[];

  cardRXChoice: any[];
  cardSRChoice: any[];
  sammRXChoice: any[];
  sammPRNChoice: any[];

  viewingStatus: boolean;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    public orders: OrderService,
    public meds: MedicationService
  ) {
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => {
          const orderId = params.get('orderId');
          if (orderId) {
            this.orders
              .getOrder(orderId)
              .then(order => (this.order = order))
              .then(order => this.getOrderEvents() && order)
              .then(order => this.orders.getOrderTests(order) && order)
              .then(order => this.orders.getOrderMeds(order))
              .then(order => this.orders.updateOrderStatus(orderId));
          } else {
            this.orderLoading = false;
            return;
          }
        })
      )
      .subscribe(() => {});
  }

  ngAfterViewInit() {
    this.viewingStatus = true;
    window.setTimeout(() =>
      this.modalService
        .open(this.modal, { ariaLabelledBy: 'order-modal-title' })
        .result.then(
          result => {
            console.log('modal closed', result);
            this.viewingStatus = false;
            this.router.navigate(['orders']);
          },
          reason => {
            console.log('modal dismissed', reason);
            this.viewingStatus = false;
            this.router.navigate(['orders']);
          }
        )
    );
  }

  doEventAction(event) {
    let actionFunction: () => Promise<boolean>;
    switch (event.id) {
      case 2:
      case 3:
        actionFunction = () => this.orders.sendOrderToCopia(this.order.id);
        break;
      case 4:
        actionFunction = () => this.orders.sendMedications(this.order.id);
        break;
      case 5:
      case 6:
        actionFunction = () => this.orders.sendOrderToLIS(this.order.id);
        break;
      case 7:
      case 8:
        actionFunction = () => this.orders.sendResultsToLIS(this.order.id);
        break;
      case 9:
      case 10:
        actionFunction = () =>
          this.orders.printReport(this.order.accessionId);
        break;
    }

    event.active = true;
    actionFunction()
      // .apply(this.orders, [this.order.id])
      .then(() => this.orders.getOrderEvents(this.order))
      .then(() => (event.active = false));
  }

  isActionEvent(event) {
    return event.id === this.order.events.reduce((id, orderEvent) => orderEvent.time && orderEvent.id > id ? orderEvent.id : id, 0) + 1
        && !event.time
        && !event.active;
  }

  getOrderEvents() {
    return new Promise((resolve, reject) => {
      this.orderLoading = true;
      setInterval(() => {
        if (this.viewingStatus) {
          this.orders.updateOrder(this.order)
            .then(order => { this.order = order; this.orderLoading = false; });
        } else {
          this.orderLoading = false;
        }
      }, 5000);
    });
  }

  displayMed(med: Medication) {
    return `${med.name} (${MedicationSource[med.source]})`;
  }

  submitMissingResults() {
    this.order.missing.forEach(result => result.submitted = true);
    this.submittedMissing = true;
    const saveToSet = confirm('Do you want to save these results to the order set?');
    this.orders.submitMissingResults(this.order, saveToSet)
      .subscribe(success => success ? alert('Results submitted successfully') : alert('Error submitting results'));
  }
}
