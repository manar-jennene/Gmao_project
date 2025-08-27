import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailmaintenancepreventiveComponent } from './detailmaintenancepreventive.component';

describe('DetailmaintenancepreventiveComponent', () => {
  let component: DetailmaintenancepreventiveComponent;
  let fixture: ComponentFixture<DetailmaintenancepreventiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailmaintenancepreventiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailmaintenancepreventiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
