import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CreditDetailComponent } from './credit-detail.component';

describe('Credit Management Detail Component', () => {
  let comp: CreditDetailComponent;
  let fixture: ComponentFixture<CreditDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ credit: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CreditDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CreditDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load credit on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.credit).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
