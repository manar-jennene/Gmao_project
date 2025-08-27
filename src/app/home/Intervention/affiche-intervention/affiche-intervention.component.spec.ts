import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheInterventionComponent } from './affiche-intervention.component';

describe('AfficheInterventionComponent', () => {
  let component: AfficheInterventionComponent;
  let fixture: ComponentFixture<AfficheInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfficheInterventionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficheInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
