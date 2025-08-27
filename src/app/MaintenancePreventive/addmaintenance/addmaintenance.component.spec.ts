import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmaintenanceComponent } from './addmaintenance.component';

describe('AddmaintenanceComponent', () => {
  let component: AddmaintenanceComponent;
  let fixture: ComponentFixture<AddmaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
