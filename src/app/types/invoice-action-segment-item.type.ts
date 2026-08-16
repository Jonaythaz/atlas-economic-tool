import type { SegmentItem } from '@kirbydesign/designsystem';

import type { InvoiceAction } from './invoice-action.type';

export type InvoiceActionSegmentItem = SegmentItem & {
	id: InvoiceAction;
};
