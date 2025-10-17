import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './pages/orders/orders.component';
import { NewOrderComponent } from './modals/new-order/new-order.component';
import { OrderComponent } from './modals/order/order.component';
import { AdminComponent } from './pages/admin/admin.component';
import { OrderSetComponent } from './modals/order-set/order-set.component';
import { OrderSetsComponent } from './pages/order-sets/order-sets.component';
import { MedSetsComponent } from './pages/med-sets/med-sets.component';
import { MedSetComponent } from './modals/med-set/med-set.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { PatientComponent } from './modals/patient/patient.component';
import { ScheduledOrdersComponent } from './pages/scheduled-orders/scheduled-orders.component';
import { ScheduledOrderComponent } from './modals/scheduled-order/scheduled-order.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders'
  },
  {
    path: 'orders',
    component: OrdersComponent,
    children: [
      {
        path: 'new',
        component: NewOrderComponent
      },
      {
        path: 'view/:orderId',
        component: OrderComponent
      }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'order-sets'
      },
      {
        path: 'order-sets',
        component: OrderSetsComponent,
        children: [
          {
            path: 'new',
            component: OrderSetComponent
          },
          {
            path: 'view/:orderSetId',
            component: OrderSetComponent
          }
        ]
      },
      {
        path: 'med-sets',
        component: MedSetsComponent,
        children: [
          {
            path: 'new',
            component: MedSetComponent
          },
          {
            path: 'view/:medSetId',
            component: MedSetComponent
          }
        ]
      },
      {
        path: 'patients',
        component: PatientsComponent,
        children: [
          {
            path: 'new',
            component: PatientComponent
          },
          {
            path: 'view/:patientId',
            component: PatientComponent
          }
        ]
      },
      {
        path: 'recurring',
        component: ScheduledOrdersComponent,
        children: [
          {
            path: 'new',
            component: ScheduledOrderComponent
          },
          {
            path: 'view/:scheduledOrderId',
            component: ScheduledOrderComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
