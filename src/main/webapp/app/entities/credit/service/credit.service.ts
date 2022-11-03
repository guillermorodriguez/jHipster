import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICredit, NewCredit } from '../credit.model';

export type PartialUpdateCredit = Partial<ICredit> & Pick<ICredit, 'id'>;

export type EntityResponseType = HttpResponse<ICredit>;
export type EntityArrayResponseType = HttpResponse<ICredit[]>;

@Injectable({ providedIn: 'root' })
export class CreditService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(credit: NewCredit): Observable<EntityResponseType> {
    return this.http.post<ICredit>(this.resourceUrl, credit, { observe: 'response' });
  }

  update(credit: ICredit): Observable<EntityResponseType> {
    return this.http.put<ICredit>(`${this.resourceUrl}/${this.getCreditIdentifier(credit)}`, credit, { observe: 'response' });
  }

  partialUpdate(credit: PartialUpdateCredit): Observable<EntityResponseType> {
    return this.http.patch<ICredit>(`${this.resourceUrl}/${this.getCreditIdentifier(credit)}`, credit, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICredit>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICredit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCreditIdentifier(credit: Pick<ICredit, 'id'>): number {
    return credit.id;
  }

  compareCredit(o1: Pick<ICredit, 'id'> | null, o2: Pick<ICredit, 'id'> | null): boolean {
    return o1 && o2 ? this.getCreditIdentifier(o1) === this.getCreditIdentifier(o2) : o1 === o2;
  }

  addCreditToCollectionIfMissing<Type extends Pick<ICredit, 'id'>>(
    creditCollection: Type[],
    ...creditsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const credits: Type[] = creditsToCheck.filter(isPresent);
    if (credits.length > 0) {
      const creditCollectionIdentifiers = creditCollection.map(creditItem => this.getCreditIdentifier(creditItem)!);
      const creditsToAdd = credits.filter(creditItem => {
        const creditIdentifier = this.getCreditIdentifier(creditItem);
        if (creditCollectionIdentifiers.includes(creditIdentifier)) {
          return false;
        }
        creditCollectionIdentifiers.push(creditIdentifier);
        return true;
      });
      return [...creditsToAdd, ...creditCollection];
    }
    return creditCollection;
  }
}
