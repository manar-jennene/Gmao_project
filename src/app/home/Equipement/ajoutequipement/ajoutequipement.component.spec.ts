import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutequipementComponent } from './ajoutequipement.component';

describe('AjoutequipementComponent', () => {
  let component: AjoutequipementComponent;
  let fixture: ComponentFixture<AjoutequipementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutequipementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutequipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
