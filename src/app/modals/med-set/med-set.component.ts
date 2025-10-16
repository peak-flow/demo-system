import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { MedicationService } from 'src/app/services/medication.service';
import { AdminService } from 'src/app/services/admin.service';
import { MedicationSet, MedicationChoiceTemplate, ReportTemplate, MedicationSource } from 'src/app/classes/medication';

@Component({
  selector: 'app-med-set',
  templateUrl: './med-set.component.html',
  styleUrls: ['./med-set.component.scss']
})
export class MedSetComponent implements AfterViewInit {
  @ViewChild('medSetModal') modal;
  protected medSetLoading: boolean = false;
  public medSet: MedicationSet;
  cardRXMeds: any[];
  cardSRMeds: any[];
  sammMeds: any[];

  cardRXChoice: any[];
  cardSRChoice: any[];
  sammRXChoice: any[];
  sammPRNChoice: any[];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    public orders: OrderService,
    public meds: MedicationService,
    public admin: AdminService
  ) {
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => {
          const medSetId = params.get('medSetId');
          if (medSetId) {
            this.medSetLoading = true;
            this.admin
              .getMedSet(Number(medSetId))
              .then(medSet => (this.medSet = medSet))
              .then(() => this.fillMeds())
              .then(() => (this.medSetLoading = false));
          } else {
            this.medSetLoading = false;
            this.medSet = new MedicationSet();
          }
        })
      )
      .subscribe(() => {});
  }

  ngAfterViewInit() {
    window.setTimeout(() =>
      this.modalService
        .open(this.modal, { ariaLabelledBy: 'order-modal-title' })
        .result.then(
          result => {
            console.log('modal closed', result);
            this.router.navigate(['admin', 'med-sets']);
          },
          reason => {
            console.log('modal dismissed', reason);
            this.router.navigate(['admin', 'med-sets'], {
              queryParams: { uncache: true }
            });
          }
        )
    );
  }

  saveMedSet() {
    this.saveMeds();
    this.admin
      .saveMedSet(this.medSet)
      .then(() => this.modalService.dismissAll('medset saved'));
  }

  getCardRX() {
    if (!this.cardRXMeds) {
      this.cardRXMeds = this.meds.getTemplate(MedicationChoiceTemplate.CARDRX);
    }

    return this.cardRXMeds;
  }

  getCardSR() {
    if (!this.cardSRMeds) {
      this.cardSRMeds = this.meds.getTemplate(MedicationChoiceTemplate.CARDSR);
    }

    return this.cardSRMeds;
  }

  getSAMM() {
    if (!this.sammMeds) {
      this.sammMeds = this.meds.getTemplate(MedicationChoiceTemplate.SAMM);
    }

    return this.sammMeds;
  }

  fillMeds() {
    if (this.medSet.template === ReportTemplate.CARD) {
      this.cardRXChoice = this.medSet.meds.filter(
        med => med.source === MedicationSource.Prescription
      );
      this.cardSRChoice = this.medSet.meds.filter(
        med => med.source === MedicationSource.SelfReported
      );
    } else {
      this.sammRXChoice = this.medSet.meds.filter(
        med => med.source === MedicationSource.Prescription
      );
      this.sammPRNChoice = this.medSet.meds.filter(
        med => med.source === MedicationSource.PrescriptionPRN
      );
    }
  }

  saveMeds() {
    let rx = [];
    let sr = [];
    let prn = [];
    if (this.medSet.template === 'R1A') {
      rx = this.cardRXChoice || [];
      sr = this.cardSRChoice || [];
    } else {
      rx = this.sammRXChoice || [];
      prn = this.sammPRNChoice || [];
    }
    this.medSet.meds = rx
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
  }

  delete() {
    this.admin
      .deleteMedSet(this.medSet.id)
      .then(() => this.modalService.dismissAll('med set deleted'));
  }
}
