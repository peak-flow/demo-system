import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { AdminService } from 'src/app/services/admin.service';
import { map } from 'rxjs/operators';
import { TestPatient } from 'src/app/classes/test-patient';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements AfterViewInit {
  @ViewChild('patientModal') modal;
  public testPatient: TestPatient = new TestPatient();
  protected patientLoading: boolean = false;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private admin: AdminService
  ) {
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => {
          const patientId = Number(params.get('patientId'));
          if (patientId) {
            this.patientLoading = true;
            this.admin.searchPatients(patientId).subscribe(
              testPatient => {
                this.testPatient = testPatient;
                this.patientLoading = false;
              }
            );
          } else {
              this.patientLoading = false;
              this.testPatient = new TestPatient();
          }
        })
      )
      .subscribe(() => {});
  }

  updateTestPatient() {
    this.admin.updatePatient(this.testPatient).then(
      () => {
          this.modalService.dismissAll('Patient has been updated.');
          alert("Patient has been updated.");
        });
  }
 
  saveTestPatient() {
    this.admin.savePatient(this.testPatient).then(
      () => {
        this.modalService.dismissAll('Patient has been saved.');
        alert("Patient has been saved.");
      });
  }

  ngAfterViewInit() {
    window.setTimeout(() =>
      this.modalService
        .open(this.modal, { ariaLabelledBy: 'order-modal-title' })
        .result.then(
          result => {
            console.log('modal closed', result);
            this.router.navigate(['admin', 'patients']);
          },
          reason => {
            console.log('modal dismissed', reason);
            this.router.navigate(['admin', 'patients'], {queryParams: {uncache: true}});
          }
        )
    );
  }
}
