import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreditComponent } from './list/credit.component';
import { CreditDetailComponent } from './detail/credit-detail.component';
import { CreditUpdateComponent } from './update/credit-update.component';
import { CreditDeleteDialogComponent } from './delete/credit-delete-dialog.component';
import { CreditRoutingModule } from './route/credit-routing.module';

@NgModule({
  imports: [SharedModule, CreditRoutingModule],
  declarations: [CreditComponent, CreditDetailComponent, CreditUpdateComponent, CreditDeleteDialogComponent],
})
export class CreditModule {}
