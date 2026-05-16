import React from "react";
import CalendarView from "../components/features/Calendar/CalendarView";
import { useCalendar } from "../hooks/useCalendar";

function CalendarScreen() {
  const calendarProps = useCalendar();

  return <CalendarView {...calendarProps} />;
}

export default CalendarScreen;
