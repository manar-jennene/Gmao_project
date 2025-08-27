import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInterventionComponent } from './detail-intervention.component';

describe('DetailInterventionComponent', () => {
  let component: DetailInterventionComponent;
  let fixture: ComponentFixture<DetailInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailInterventionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
