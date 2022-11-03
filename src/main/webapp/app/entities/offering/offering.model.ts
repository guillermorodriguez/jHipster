export interface IOffering {
  id: number;
  name?: string | null;
  rate?: number | null;
  startYear?: number | null;
}

export type NewOffering = Omit<IOffering, 'id'> & { id: null };
