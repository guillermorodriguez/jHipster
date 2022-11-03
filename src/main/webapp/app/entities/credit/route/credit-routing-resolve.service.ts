import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICredit } from '../credit.model';
import { CreditService } from '../service/credit.service';

@Injectable({ providedIn: 'root' })
export class CreditRoutingResolveService implements Resolve<ICredit | null> {
  constructor(protected service: CreditService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICredit | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((credit: HttpResponse<ICredit>) => {
          if (credit.body) {
            return of(credit.body);
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
