import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireballComponent } from './fireball.component';

describe('FireballComponent', () => {
  let component: FireballComponent;
  let fixture: ComponentFixture<FireballComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FireballComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FireballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
