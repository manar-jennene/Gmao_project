import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheaquipementComponent } from './afficheaquipement.component';

describe('AfficheaquipementComponent', () => {
  let component: AfficheaquipementComponent;
  let fixture: ComponentFixture<AfficheaquipementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfficheaquipementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficheaquipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
