import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostgameComponent } from './postgame.component';

describe('PostgameComponent', () => {
  let component: PostgameComponent;
  let fixture: ComponentFixture<PostgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostgameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
