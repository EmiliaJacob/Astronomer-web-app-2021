import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedAsteroidsComponent } from './saved-asteroids.component';

describe('SavedAsteroidsComponent', () => {
  let component: SavedAsteroidsComponent;
  let fixture: ComponentFixture<SavedAsteroidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedAsteroidsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedAsteroidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
