import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichestatutComponent } from './affichestatut.component';

describe('AffichestatutComponent', () => {
  let component: AffichestatutComponent;
  let fixture: ComponentFixture<AffichestatutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffichestatutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffichestatutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
