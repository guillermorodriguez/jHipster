import { ICredit, NewCredit } from './credit.model';

export const sampleWithRequiredData: ICredit = {
  id: 10215,
};

export const sampleWithPartialData: ICredit = {
  id: 84314,
  description: 'Pound',
};

export const sampleWithFullData: ICredit = {
  id: 36620,
  name: 'Metal supply-chains Concrete',
  description: 'Borders Dynamic',
  isActive: false,
};

export const sampleWithNewData: NewCredit = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
