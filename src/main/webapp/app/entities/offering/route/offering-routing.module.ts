import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OfferingComponent } from '../list/offering.component';
import { OfferingDetailComponent } from '../detail/offering-detail.component';
import { OfferingUpdateComponent } from '../update/offering-update.component';
import { OfferingRoutingResolveService } from './offering-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const offeringRoute: Routes = [
  {
    path: '',
    component: OfferingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OfferingDetailComponent,
    resolve: {
      offering: OfferingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OfferingUpdateComponent,
    resolve: {
      offering: OfferingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OfferingUpdateComponent,
    resolve: {
      offering: OfferingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(offeringRoute)],
  exports: [RouterModule],
})
export class OfferingRoutingModule {}
