import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentComponent } from './development';

describe('Blog', () => {
  let component: DevelopmentComponent;
  let fixture: ComponentFixture<DevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevelopmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
