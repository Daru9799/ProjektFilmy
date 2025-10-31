export interface CalendarEventDto {
  summary: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  eventType: string;
  movieId?: string;
  attendeesEmails?: string[];
  locationName?: string;
  locationAddress?: string;
}