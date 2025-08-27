import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeStockComponent } from './liste-stock.component';

describe('ListeStockComponent', () => {
  let component: ListeStockComponent;
  let fixture: ComponentFixture<ListeStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
