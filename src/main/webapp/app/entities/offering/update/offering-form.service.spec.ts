import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../offering.test-samples';

import { OfferingFormService } from './offering-form.service';

describe('Offering Form Service', () => {
  let service: OfferingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferingFormService);
  });

  describe('Service methods', () => {
    describe('createOfferingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOfferingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            rate: expect.any(Object),
            startYear: expect.any(Object),
          })
        );
      });

      it('passing IOffering should create a new form with FormGroup', () => {
        const formGroup = service.createOfferingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            rate: expect.any(Object),
            startYear: expect.any(Object),
          })
        );
      });
    });

    describe('getOffering', () => {
      it('should return NewOffering for default Offering initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOfferingFormGroup(sampleWithNewData);

        const offering = service.getOffering(formGroup) as any;

        expect(offering).toMatchObject(sampleWithNewData);
      });

      it('should return NewOffering for empty Offering initial value', () => {
        const formGroup = service.createOfferingFormGroup();

        const offering = service.getOffering(formGroup) as any;

        expect(offering).toMatchObject({});
      });

      it('should return IOffering', () => {
        const formGroup = service.createOfferingFormGroup(sampleWithRequiredData);

        const offering = service.getOffering(formGroup) as any;

        expect(offering).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOffering should not enable id FormControl', () => {
        const formGroup = service.createOfferingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOffering should disable id FormControl', () => {
        const formGroup = service.createOfferingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
