import { OverviewSegment } from "@atlas/types";
import type { SegmentItem } from "@kirbydesign/designsystem";

export const OVERVIEW_SEGMENTS: Record<OverviewSegment, SegmentItem> = {
	[OverviewSegment.Documents]: {
		id: OverviewSegment.Documents,
		text: "Documents",
	},
	[OverviewSegment.Customers]: {
		id: OverviewSegment.Customers,
		text: "Customers",
	},
	[OverviewSegment.Products]: {
		id: OverviewSegment.Products,
		text: "Products",
	},
};
