import { CreditNoteModel } from "../models";
import { CreditNoteState } from "./credit-note-state.type";

export type CreditNote = {
    model: CreditNoteModel;
    state: CreditNoteState;
};