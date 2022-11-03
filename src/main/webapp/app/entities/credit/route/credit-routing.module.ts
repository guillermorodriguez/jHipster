import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditComponent } from '../list/credit.component';
import { CreditDetailComponent } from '../detail/credit-detail.component';
import { CreditUpdateComponent } from '../update/credit-update.component';
import { CreditRoutingResolveService } from './credit-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const creditRoute: Routes = [
  {
    path: '',
    component: CreditComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditDetailComponent,
    resolve: {
      credit: CreditRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditUpdateComponent,
    resolve: {
      credit: CreditRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditUpdateComponent,
    resolve: {
      credit: CreditRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(creditRoute)],
  exports: [RouterModule],
})
export class CreditRoutingModule {}
