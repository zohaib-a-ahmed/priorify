export type Event = {
  title: string;
  id: string;
  user_id: number;
  event_date_start: string;
  event_date_end: string;
  description: string;
  event_time: string;
};

export type Reminder = {
  title: string;
  id: number;
  user_id: number;
  description: string;
  due: string;
};
