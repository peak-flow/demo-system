import { Medication, MedicationSet } from './medication';
import { OrderSet } from './order-set';

export class Order {
    id: number;
    accessionId: number;
    sampleId: string;
    created: Date;
    status: OrderStatus;
    location: OrderLocation;
    doctor: OrderDoctor;
    patient: OrderPatient;
    orderSet: OrderSet;
    medSet: MedicationSet;
    events?: OrderEvent[];
    missing?: MissingResult[];
    received?: OrderResult[];
    validation?: OrderResult[];
    orders: any[];
}

export class OrderStatus {
    id: number;
    name: string;
}
export class OrderLocation {
    id: number;
    name: string;
    template: string;
}

export class OrderDoctor {
    id: number;
    name: string;
}

export class OrderPatient {
    id: number;
    name: string;
}

export class OrderEvent {
    id: number;
    name: string;
    time: Date;
    active?: boolean;
    actionName: string;
    message: string;
    skipped: boolean;
}

export class OrderQuery {
    searchBy: string;
    term: string;
    exactMatch: boolean;
}

export class DateQuery {
    fromDate: string;
    toDate: string;
}

export class MissingResult {
    code: string;
    name: string;
    result: string;
    submitted?: boolean;
}

export class OrderResult {
    code: string;
    name: string;
    result: string;
}
