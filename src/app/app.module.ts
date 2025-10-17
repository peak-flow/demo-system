import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavigatorComponent } from './components/navigator/navigator.component';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { MessageService } from './services/message.service';

import { OrderService } from './services/order.service';

import { AdminComponent } from './pages/admin/admin.component';
import { OrdersComponent } from './pages/orders/orders.component';

import { NewOrderComponent } from './modals/new-order/new-order.component';
import { OrderComponent } from './modals/order/order.component';
import { FormsModule } from '@angular/forms';
import { MedicationService } from './services/medication.service';
import { OrderSetComponent } from './modals/order-set/order-set.component';
import { OrderSetsComponent } from './pages/order-sets/order-sets.component';
import { AdminService } from './services/admin.service';
import { MedSetsComponent } from './pages/med-sets/med-sets.component';
import { MedSetComponent } from './modals/med-set/med-set.component';
import { PatientComponent } from './modals/patient/patient.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { ScheduledOrdersComponent } from './pages/scheduled-orders/scheduled-orders.component';
import { ScheduledOrderComponent } from './modals/scheduled-order/scheduled-order.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigatorComponent,
    AdminComponent,
    OrderComponent,
    OrdersComponent,
    NewOrderComponent,
    OrderSetComponent,
    OrderSetsComponent,
    MedSetsComponent,
    MedSetComponent,
    PatientComponent,
    PatientsComponent,
    ScheduledOrdersComponent,
    ScheduledOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    NgbModule,
    NgSelectModule,
    FormsModule
  ],
  providers: [
    ApiService,
    UserService,
    MessageService,
    OrderService,
    MedicationService,
    AdminService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
