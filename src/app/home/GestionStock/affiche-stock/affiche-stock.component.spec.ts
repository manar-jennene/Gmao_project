import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheStockComponent } from './affiche-stock.component';

describe('AfficheStockComponent', () => {
  let component: AfficheStockComponent;
  let fixture: ComponentFixture<AfficheStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfficheStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficheStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
