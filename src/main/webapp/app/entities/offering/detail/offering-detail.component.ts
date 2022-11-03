import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOffering } from '../offering.model';

@Component({
  selector: 'jhi-offering-detail',
  templateUrl: './offering-detail.component.html',
})
export class OfferingDetailComponent implements OnInit {
  offering: IOffering | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offering }) => {
      this.offering = offering;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
