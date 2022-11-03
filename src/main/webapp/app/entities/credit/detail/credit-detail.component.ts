import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICredit } from '../credit.model';

@Component({
  selector: 'jhi-credit-detail',
  templateUrl: './credit-detail.component.html',
})
export class CreditDetailComponent implements OnInit {
  credit: ICredit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ credit }) => {
      this.credit = credit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
