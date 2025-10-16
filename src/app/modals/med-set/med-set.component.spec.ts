import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedSetComponent } from './med-set.component';

describe('MedSetComponent', () => {
  let component: MedSetComponent;
  let fixture: ComponentFixture<MedSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
