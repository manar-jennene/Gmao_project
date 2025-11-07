import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxstatutComponent } from './fluxstatut.component';

describe('FluxstatutComponent', () => {
  let component: FluxstatutComponent;
  let fixture: ComponentFixture<FluxstatutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FluxstatutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FluxstatutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
