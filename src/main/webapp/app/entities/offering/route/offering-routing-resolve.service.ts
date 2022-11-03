import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOffering } from '../offering.model';
import { OfferingService } from '../service/offering.service';

@Injectable({ providedIn: 'root' })
export class OfferingRoutingResolveService implements Resolve<IOffering | null> {
  constructor(protected service: OfferingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOffering | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((offering: HttpResponse<IOffering>) => {
          if (offering.body) {
            return of(offering.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
