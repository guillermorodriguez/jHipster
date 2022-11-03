import { IOffering, NewOffering } from './offering.model';

export const sampleWithRequiredData: IOffering = {
  id: 42660,
};

export const sampleWithPartialData: IOffering = {
  id: 86755,
  name: 'Locks B2C eco-centric',
  rate: 10827,
  startYear: 84693,
};

export const sampleWithFullData: IOffering = {
  id: 78759,
  name: 'deposit',
  rate: 90631,
  startYear: 74965,
};

export const sampleWithNewData: NewOffering = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
