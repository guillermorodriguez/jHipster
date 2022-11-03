import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CreditFormService, CreditFormGroup } from './credit-form.service';
import { ICredit } from '../credit.model';
import { CreditService } from '../service/credit.service';

@Component({
  selector: 'jhi-credit-update',
  templateUrl: './credit-update.component.html',
})
export class CreditUpdateComponent implements OnInit {
  isSaving = false;
  credit: ICredit | null = null;

  editForm: CreditFormGroup = this.creditFormService.createCreditFormGroup();

  constructor(
    protected creditService: CreditService,
    protected creditFormService: CreditFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ credit }) => {
      this.credit = credit;
      if (credit) {
        this.updateForm(credit);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const credit = this.creditFormService.getCredit(this.editForm);
    if (credit.id !== null) {
      this.subscribeToSaveResponse(this.creditService.update(credit));
    } else {
      this.subscribeToSaveResponse(this.creditService.create(credit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICredit>>): void {
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

  protected updateForm(credit: ICredit): void {
    this.credit = credit;
    this.creditFormService.resetForm(this.editForm, credit);
  }
}
