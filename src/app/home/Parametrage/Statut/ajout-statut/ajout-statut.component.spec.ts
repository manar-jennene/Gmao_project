import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutStatutComponent } from './ajout-statut.component';

describe('AjoutStatutComponent', () => {
  let component: AjoutStatutComponent;
  let fixture: ComponentFixture<AjoutStatutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutStatutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutStatutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
