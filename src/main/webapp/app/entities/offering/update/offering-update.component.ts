import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { OfferingFormService, OfferingFormGroup } from './offering-form.service';
import { IOffering } from '../offering.model';
import { OfferingService } from '../service/offering.service';

@Component({
  selector: 'jhi-offering-update',
  templateUrl: './offering-update.component.html',
})
export class OfferingUpdateComponent implements OnInit {
  isSaving = false;
  offering: IOffering | null = null;

  editForm: OfferingFormGroup = this.offeringFormService.createOfferingFormGroup();

  constructor(
    protected offeringService: OfferingService,
    protected offeringFormService: OfferingFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offering }) => {
      this.offering = offering;
      if (offering) {
        this.updateForm(offering);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offering = this.offeringFormService.getOffering(this.editForm);
    if (offering.id !== null) {
      this.subscribeToSaveResponse(this.offeringService.update(offering));
    } else {
      this.subscribeToSaveResponse(this.offeringService.create(offering));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffering>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(offering: IOffering): void {
    this.offering = offering;
    this.offeringFormService.resetForm(this.editForm, offering);
  }
}
