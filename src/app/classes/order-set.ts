export class OrderSet {
    id: number;
    name: string;
    panels?: OrderPanel[];
    tdPanels?: OrderTdPanel[];
    results?: OrderResult[];
}

export class OrderPanel {
    id: string;
    name: string;
}

export class OrderTdPanel {
    id: string;
    name: string;
}

export class OrderResult {
    id: string;
    result: string;
    priority: number;
}

export class OrderProfile {
    name: string;
    profileCode: string;
    testId?: number;
    tests?: OrderTest[];
}

export class OrderTest {
    name: string;
    hostCode: string;
    result: string;
}
