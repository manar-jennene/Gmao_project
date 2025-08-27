import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignresponsableComponent } from './assignresponsable.component';

describe('AssignresponsableComponent', () => {
  let component: AssignresponsableComponent;
  let fixture: ComponentFixture<AssignresponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignresponsableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignresponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
