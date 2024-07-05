import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationAttractionListComponent } from './destination-attraction-list.component';

describe('DestinationAttractionListComponent', () => {
  let component: DestinationAttractionListComponent;
  let fixture: ComponentFixture<DestinationAttractionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationAttractionListComponent]
    });
    fixture = TestBed.createComponent(DestinationAttractionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
