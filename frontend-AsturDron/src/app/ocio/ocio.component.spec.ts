import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcioComponent } from './ocio.component';

describe('OcioComponent', () => {
  let component: OcioComponent;
  let fixture: ComponentFixture<OcioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OcioComponent]
    });
    fixture = TestBed.createComponent(OcioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
