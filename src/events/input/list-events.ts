export class ListEvnets {
  when: WhenEventFilter = WhenEventFilter.All;
}

export enum WhenEventFilter {
  All = 1,
  Today,
  Tomorrow,
  ThisWeek,
  NextWeek,
}
