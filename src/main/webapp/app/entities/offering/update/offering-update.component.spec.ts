import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OfferingFormService } from './offering-form.service';
import { OfferingService } from '../service/offering.service';
import { IOffering } from '../offering.model';

import { OfferingUpdateComponent } from './offering-update.component';

describe('Offering Management Update Component', () => {
  let comp: OfferingUpdateComponent;
  let fixture: ComponentFixture<OfferingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offeringFormService: OfferingFormService;
  let offeringService: OfferingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OfferingUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OfferingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfferingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offeringFormService = TestBed.inject(OfferingFormService);
    offeringService = TestBed.inject(OfferingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const offering: IOffering = { id: 456 };

      activatedRoute.data = of({ offering });
      comp.ngOnInit();

      expect(comp.offering).toEqual(offering);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffering>>();
      const offering = { id: 123 };
      jest.spyOn(offeringFormService, 'getOffering').mockReturnValue(offering);
      jest.spyOn(offeringService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offering });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offering }));
      saveSubject.complete();

      // THEN
      expect(offeringFormService.getOffering).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(offeringService.update).toHaveBeenCalledWith(expect.objectContaining(offering));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffering>>();
      const offering = { id: 123 };
      jest.spyOn(offeringFormService, 'getOffering').mockReturnValue({ id: null });
      jest.spyOn(offeringService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offering: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offering }));
      saveSubject.complete();

      // THEN
      expect(offeringFormService.getOffering).toHaveBeenCalled();
      expect(offeringService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffering>>();
      const offering = { id: 123 };
      jest.spyOn(offeringService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offering });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offeringService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
