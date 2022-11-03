import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CreditFormService } from './credit-form.service';
import { CreditService } from '../service/credit.service';
import { ICredit } from '../credit.model';

import { CreditUpdateComponent } from './credit-update.component';

describe('Credit Management Update Component', () => {
  let comp: CreditUpdateComponent;
  let fixture: ComponentFixture<CreditUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let creditFormService: CreditFormService;
  let creditService: CreditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CreditUpdateComponent],
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
      .overrideTemplate(CreditUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    creditFormService = TestBed.inject(CreditFormService);
    creditService = TestBed.inject(CreditService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const credit: ICredit = { id: 456 };

      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      expect(comp.credit).toEqual(credit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICredit>>();
      const credit = { id: 123 };
      jest.spyOn(creditFormService, 'getCredit').mockReturnValue(credit);
      jest.spyOn(creditService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: credit }));
      saveSubject.complete();

      // THEN
      expect(creditFormService.getCredit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(creditService.update).toHaveBeenCalledWith(expect.objectContaining(credit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICredit>>();
      const credit = { id: 123 };
      jest.spyOn(creditFormService, 'getCredit').mockReturnValue({ id: null });
      jest.spyOn(creditService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ credit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: credit }));
      saveSubject.complete();

      // THEN
      expect(creditFormService.getCredit).toHaveBeenCalled();
      expect(creditService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICredit>>();
      const credit = { id: 123 };
      jest.spyOn(creditService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(creditService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
