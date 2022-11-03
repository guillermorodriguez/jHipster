import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffering, NewOffering } from '../offering.model';

export type PartialUpdateOffering = Partial<IOffering> & Pick<IOffering, 'id'>;

export type EntityResponseType = HttpResponse<IOffering>;
export type EntityArrayResponseType = HttpResponse<IOffering[]>;

@Injectable({ providedIn: 'root' })
export class OfferingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offerings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offering: NewOffering): Observable<EntityResponseType> {
    return this.http.post<IOffering>(this.resourceUrl, offering, { observe: 'response' });
  }

  update(offering: IOffering): Observable<EntityResponseType> {
    return this.http.put<IOffering>(`${this.resourceUrl}/${this.getOfferingIdentifier(offering)}`, offering, { observe: 'response' });
  }

  partialUpdate(offering: PartialUpdateOffering): Observable<EntityResponseType> {
    return this.http.patch<IOffering>(`${this.resourceUrl}/${this.getOfferingIdentifier(offering)}`, offering, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOffering>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffering[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOfferingIdentifier(offering: Pick<IOffering, 'id'>): number {
    return offering.id;
  }

  compareOffering(o1: Pick<IOffering, 'id'> | null, o2: Pick<IOffering, 'id'> | null): boolean {
    return o1 && o2 ? this.getOfferingIdentifier(o1) === this.getOfferingIdentifier(o2) : o1 === o2;
  }

  addOfferingToCollectionIfMissing<Type extends Pick<IOffering, 'id'>>(
    offeringCollection: Type[],
    ...offeringsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const offerings: Type[] = offeringsToCheck.filter(isPresent);
    if (offerings.length > 0) {
      const offeringCollectionIdentifiers = offeringCollection.map(offeringItem => this.getOfferingIdentifier(offeringItem)!);
      const offeringsToAdd = offerings.filter(offeringItem => {
        const offeringIdentifier = this.getOfferingIdentifier(offeringItem);
        if (offeringCollectionIdentifiers.includes(offeringIdentifier)) {
          return false;
        }
        offeringCollectionIdentifiers.push(offeringIdentifier);
        return true;
      });
      return [...offeringsToAdd, ...offeringCollection];
    }
    return offeringCollection;
  }
}
