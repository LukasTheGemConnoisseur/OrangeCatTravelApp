import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationAttractionDetailsComponent } from './destination-attraction-details.component';

describe('DestinationAttractionDetailsComponent', () => {
  let component: DestinationAttractionDetailsComponent;
  let fixture: ComponentFixture<DestinationAttractionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationAttractionDetailsComponent]
    });
    fixture = TestBed.createComponent(DestinationAttractionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
