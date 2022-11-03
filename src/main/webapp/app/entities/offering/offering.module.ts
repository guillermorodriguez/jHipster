import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OfferingComponent } from './list/offering.component';
import { OfferingDetailComponent } from './detail/offering-detail.component';
import { OfferingUpdateComponent } from './update/offering-update.component';
import { OfferingDeleteDialogComponent } from './delete/offering-delete-dialog.component';
import { OfferingRoutingModule } from './route/offering-routing.module';

@NgModule({
  imports: [SharedModule, OfferingRoutingModule],
  declarations: [OfferingComponent, OfferingDetailComponent, OfferingUpdateComponent, OfferingDeleteDialogComponent],
})
export class OfferingModule {}
