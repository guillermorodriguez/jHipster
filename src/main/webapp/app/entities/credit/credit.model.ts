export interface ICredit {
  id: number;
  name?: string | null;
  description?: string | null;
  isActive?: boolean | null;
}

export type NewCredit = Omit<ICredit, 'id'> & { id: null };
