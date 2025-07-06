import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLevelAgreement } from './service-level-agreement';

describe('ServiceLevelAgreement', () => {
  let component: ServiceLevelAgreement;
  let fixture: ComponentFixture<ServiceLevelAgreement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceLevelAgreement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceLevelAgreement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
