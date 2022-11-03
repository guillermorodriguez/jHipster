import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICredit, NewCredit } from '../credit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICredit for edit and NewCreditFormGroupInput for create.
 */
type CreditFormGroupInput = ICredit | PartialWithRequiredKeyOf<NewCredit>;

type CreditFormDefaults = Pick<NewCredit, 'id' | 'isActive'>;

type CreditFormGroupContent = {
  id: FormControl<ICredit['id'] | NewCredit['id']>;
  name: FormControl<ICredit['name']>;
  description: FormControl<ICredit['description']>;
  isActive: FormControl<ICredit['isActive']>;
};

export type CreditFormGroup = FormGroup<CreditFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CreditFormService {
  createCreditFormGroup(credit: CreditFormGroupInput = { id: null }): CreditFormGroup {
    const creditRawValue = {
      ...this.getFormDefaults(),
      ...credit,
    };
    return new FormGroup<CreditFormGroupContent>({
      id: new FormControl(
        { value: creditRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(creditRawValue.name),
      description: new FormControl(creditRawValue.description),
      isActive: new FormControl(creditRawValue.isActive),
    });
  }

  getCredit(form: CreditFormGroup): ICredit | NewCredit {
    return form.getRawValue() as ICredit | NewCredit;
  }

  resetForm(form: CreditFormGroup, credit: CreditFormGroupInput): void {
    const creditRawValue = { ...this.getFormDefaults(), ...credit };
    form.reset(
      {
        ...creditRawValue,
        id: { value: creditRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CreditFormDefaults {
    return {
      id: null,
      isActive: false,
    };
  }
}
