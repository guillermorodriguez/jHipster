import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OfferingService } from '../service/offering.service';

import { OfferingComponent } from './offering.component';

describe('Offering Management Component', () => {
  let comp: OfferingComponent;
  let fixture: ComponentFixture<OfferingComponent>;
  let service: OfferingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'offering', component: OfferingComponent }]), HttpClientTestingModule],
      declarations: [OfferingComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(OfferingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfferingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OfferingService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.offerings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to offeringService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOfferingIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOfferingIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
