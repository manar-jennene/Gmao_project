import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailstatutComponent } from './detailstatut.component';

describe('DetailstatutComponent', () => {
  let component: DetailstatutComponent;
  let fixture: ComponentFixture<DetailstatutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailstatutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailstatutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
