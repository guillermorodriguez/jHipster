import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OfferingDetailComponent } from './offering-detail.component';

describe('Offering Management Detail Component', () => {
  let comp: OfferingDetailComponent;
  let fixture: ComponentFixture<OfferingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfferingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ offering: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OfferingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OfferingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load offering on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.offering).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
