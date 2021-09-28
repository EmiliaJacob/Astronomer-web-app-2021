import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsteroidsSearchComponent } from './asteroids-search.component';

describe('AsteroidsSearchComponent', () => {
  let component: AsteroidsSearchComponent;
  let fixture: ComponentFixture<AsteroidsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsteroidsSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsteroidsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
