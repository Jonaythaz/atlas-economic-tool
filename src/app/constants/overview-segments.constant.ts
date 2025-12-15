import { SegmentItem } from "@kirbydesign/designsystem";
import { OverviewSegment } from "../types";

export const OVERVIEW_SEGMENTS: Record<OverviewSegment, SegmentItem> = {
    [OverviewSegment.Documents]: {
        id: OverviewSegment.Documents,
        text: 'Documents',
    },
    [OverviewSegment.Customers]: {
        id: OverviewSegment.Customers,
        text: 'Customers',
    },
    [OverviewSegment.Products]: {
        id: OverviewSegment.Products,
        text: 'Products',
    },
};