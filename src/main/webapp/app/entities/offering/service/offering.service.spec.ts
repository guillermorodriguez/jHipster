import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOffering } from '../offering.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../offering.test-samples';

import { OfferingService } from './offering.service';

const requireRestSample: IOffering = {
  ...sampleWithRequiredData,
};

describe('Offering Service', () => {
  let service: OfferingService;
  let httpMock: HttpTestingController;
  let expectedResult: IOffering | IOffering[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OfferingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Offering', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const offering = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(offering).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Offering', () => {
      const offering = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(offering).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Offering', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Offering', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Offering', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOfferingToCollectionIfMissing', () => {
      it('should add a Offering to an empty array', () => {
        const offering: IOffering = sampleWithRequiredData;
        expectedResult = service.addOfferingToCollectionIfMissing([], offering);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offering);
      });

      it('should not add a Offering to an array that contains it', () => {
        const offering: IOffering = sampleWithRequiredData;
        const offeringCollection: IOffering[] = [
          {
            ...offering,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOfferingToCollectionIfMissing(offeringCollection, offering);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Offering to an array that doesn't contain it", () => {
        const offering: IOffering = sampleWithRequiredData;
        const offeringCollection: IOffering[] = [sampleWithPartialData];
        expectedResult = service.addOfferingToCollectionIfMissing(offeringCollection, offering);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offering);
      });

      it('should add only unique Offering to an array', () => {
        const offeringArray: IOffering[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const offeringCollection: IOffering[] = [sampleWithRequiredData];
        expectedResult = service.addOfferingToCollectionIfMissing(offeringCollection, ...offeringArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const offering: IOffering = sampleWithRequiredData;
        const offering2: IOffering = sampleWithPartialData;
        expectedResult = service.addOfferingToCollectionIfMissing([], offering, offering2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offering);
        expect(expectedResult).toContain(offering2);
      });

      it('should accept null and undefined values', () => {
        const offering: IOffering = sampleWithRequiredData;
        expectedResult = service.addOfferingToCollectionIfMissing([], null, offering, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offering);
      });

      it('should return initial array if no Offering is added', () => {
        const offeringCollection: IOffering[] = [sampleWithRequiredData];
        expectedResult = service.addOfferingToCollectionIfMissing(offeringCollection, undefined, null);
        expect(expectedResult).toEqual(offeringCollection);
      });
    });

    describe('compareOffering', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOffering(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOffering(entity1, entity2);
        const compareResult2 = service.compareOffering(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOffering(entity1, entity2);
        const compareResult2 = service.compareOffering(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOffering(entity1, entity2);
        const compareResult2 = service.compareOffering(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
