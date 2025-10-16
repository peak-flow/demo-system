import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSetsComponent } from './order-sets.component';

describe('OrderSetsComponent', () => {
  let component: OrderSetsComponent;
  let fixture: ComponentFixture<OrderSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
