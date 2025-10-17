import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedSetsComponent } from './med-sets.component';

describe('MedSetsComponent', () => {
  let component: MedSetsComponent;
  let fixture: ComponentFixture<MedSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
