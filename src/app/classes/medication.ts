export class Medication {
    id: number;
    name: string;
    type: MedicationType;
    templates?: MedicationChoiceTemplate[];
    source?: MedicationSource;

    constructor(med: any, type: MedicationType) {
        this.id = Number(med.ID) || med.id;
        this.name = med.name;
        this.source = med.source;
        this.templates = (med.templates || []).map(template => Number(template) as MedicationChoiceTemplate);
        this.type = type;
    }
}

export enum MedicationType {
    Generic, Brand
}

export enum MedicationChoiceTemplate {
    CARDSR = 1,
    CARDRX = 2,
    SAMM = 3
}

export enum MedicationSource {
    Prescription = 1,
    SelfReported = 2,
    PrescriptionPRN = 3
}

export class MedicationSet {
  id: number;
  name: string;
  template: ReportTemplate;
  meds: Medication[];
  new?: boolean;

  constructor() {
      this.new = true;
  }
}

export enum ReportTemplate {
    CARD = 'R1A',
    SAMM = 'R1P'
}
