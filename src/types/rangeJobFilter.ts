export const RangeJobFilter = {
  DAY: "day",
  WEEK: "week",
} as const;

export type RangeJobFilter =
  (typeof RangeJobFilter)[keyof typeof RangeJobFilter];