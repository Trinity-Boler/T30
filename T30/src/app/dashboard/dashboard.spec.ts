import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashborad } from './dashboard';

describe('Dashborad', () => {
  let component: Dashborad;
  let fixture: ComponentFixture<Dashborad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashborad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashborad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
