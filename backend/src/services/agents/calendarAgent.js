import { google } from "googleapis";

class CalendarAgent {
  constructor(tokens) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials(tokens);
    this.calendar = google.calendar({ version: "v3", auth });
  }

  async createEvent(summary, start, end) {
    const event = {
      summary,
      start: { dateTime: start },
      end: { dateTime: end }
    };

    return await this.calendar.events.insert({
      calendarId: "primary",
      requestBody: event
    });
  }
}

export default CalendarAgent;