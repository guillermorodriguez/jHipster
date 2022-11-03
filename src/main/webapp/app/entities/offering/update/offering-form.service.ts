import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOffering, NewOffering } from '../offering.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOffering for edit and NewOfferingFormGroupInput for create.
 */
type OfferingFormGroupInput = IOffering | PartialWithRequiredKeyOf<NewOffering>;

type OfferingFormDefaults = Pick<NewOffering, 'id'>;

type OfferingFormGroupContent = {
  id: FormControl<IOffering['id'] | NewOffering['id']>;
  name: FormControl<IOffering['name']>;
  rate: FormControl<IOffering['rate']>;
  startYear: FormControl<IOffering['startYear']>;
};

export type OfferingFormGroup = FormGroup<OfferingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OfferingFormService {
  createOfferingFormGroup(offering: OfferingFormGroupInput = { id: null }): OfferingFormGroup {
    const offeringRawValue = {
      ...this.getFormDefaults(),
      ...offering,
    };
    return new FormGroup<OfferingFormGroupContent>({
      id: new FormControl(
        { value: offeringRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(offeringRawValue.name),
      rate: new FormControl(offeringRawValue.rate),
      startYear: new FormControl(offeringRawValue.startYear),
    });
  }

  getOffering(form: OfferingFormGroup): IOffering | NewOffering {
    return form.getRawValue() as IOffering | NewOffering;
  }

  resetForm(form: OfferingFormGroup, offering: OfferingFormGroupInput): void {
    const offeringRawValue = { ...this.getFormDefaults(), ...offering };
    form.reset(
      {
        ...offeringRawValue,
        id: { value: offeringRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OfferingFormDefaults {
    return {
      id: null,
    };
  }
}
