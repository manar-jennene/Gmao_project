import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailprioriteComponent } from './detailpriorite.component';

describe('DetailprioriteComponent', () => {
  let component: DetailprioriteComponent;
  let fixture: ComponentFixture<DetailprioriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailprioriteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailprioriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
