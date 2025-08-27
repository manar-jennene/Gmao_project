import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichemaintenancepreventiveComponent } from './affichemaintenancepreventive.component';

describe('AffichemaintenancepreventiveComponent', () => {
  let component: AffichemaintenancepreventiveComponent;
  let fixture: ComponentFixture<AffichemaintenancepreventiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffichemaintenancepreventiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffichemaintenancepreventiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
