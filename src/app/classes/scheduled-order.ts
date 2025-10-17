import { OrderLocation, OrderDoctor, OrderPatient } from './order';
import { OrderSet } from './order-set';
import { MedicationSet } from './medication';

export class ScheduledOrder {
    id?: number;
    location: OrderLocation;
    doctor: OrderDoctor;
    patient: OrderPatient;
    orderSet: OrderSet;
    medSet: MedicationSet;
    period: ScheduledOrderPeriod = 1;
    day: number;
    hour: number;
    enabled: boolean = false;
}

export enum ScheduledOrderPeriod {
    Weekly = 1,
    Monthly = 2
}
