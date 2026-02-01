export type CustomerModel = {
  id: number;
  ean?: string;
  name: string;
  group: number;
  vatZone: number;
  paymentTerms: number;
};
