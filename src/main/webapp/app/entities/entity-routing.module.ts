import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'credit',
        data: { pageTitle: 'creditApp.credit.home.title' },
        loadChildren: () => import('./credit/credit.module').then(m => m.CreditModule),
      },
      {
        path: 'offering',
        data: { pageTitle: 'creditApp.offering.home.title' },
        loadChildren: () => import('./offering/offering.module').then(m => m.OfferingModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
