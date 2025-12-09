import { InvoiceModel } from "../models";
import { InvoiceState } from "./invoice-state.type";

export type Invoice = {
    model: InvoiceModel;
    state: InvoiceState;
};