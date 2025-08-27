import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheprioriteComponent } from './affichepriorite.component';

describe('AfficheprioriteComponent', () => {
  let component: AfficheprioriteComponent;
  let fixture: ComponentFixture<AfficheprioriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfficheprioriteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficheprioriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
