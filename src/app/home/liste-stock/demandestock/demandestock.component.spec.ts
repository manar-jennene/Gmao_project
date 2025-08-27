import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandestockComponent } from './demandestock.component';

describe('DemandestockComponent', () => {
  let component: DemandestockComponent;
  let fixture: ComponentFixture<DemandestockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandestockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
