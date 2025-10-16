import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Medication, MedicationType, MedicationChoiceTemplate } from '../classes/medication';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private generics: Medication[] = [];
  private brands: Medication[] = [];

  constructor(private api: ApiService) {
    this.getGenerics();
    this.getBrands();
  }

  getGenerics(): void {
    this.api
      .get('meds/generic/list')
      .subscribe(generics => 
        (this.generics = Object.values(generics).filter((generic: any) => generic.is_med === 'Y')
                          .map(generic => new Medication(generic, MedicationType.Generic))));
  }

  getBrands(): void {
    this.api
      .get('meds/brand/list')
      .subscribe(brands => (this.brands = Object.values(brands).map(brand => new Medication(brand, MedicationType.Brand))));
  }

  getTemplate(template: MedicationChoiceTemplate) {
    return this.generics.filter(generic => generic.templates.includes(template))
      .concat(this.brands.filter(brand => brand.templates.includes(template)))
      .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0);
  }
}
