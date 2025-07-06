import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCard } from './portfolio-card';

describe('PortfolioCard', () => {
  let component: PortfolioCard;
  let fixture: ComponentFixture<PortfolioCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
