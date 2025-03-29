"use client";

import type React from "react";
import { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer, type SlotInfo } from "react-big-calendar";
import moment from "moment";
import NewEventModal from "@/components/CardEventosPorUsuario/MocalCalendario";
const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

const initialEvents: Event[] = [
  {
    title: "Meeting",
    start: new Date(2023, 10, 1, 10, 0),
    end: new Date(2023, 10, 1, 11, 30),
  },
  {
    title: "Lunch",
    start: new Date(2023, 10, 3, 12, 0),
    end: new Date(2023, 10, 3, 13, 0),
  },
  {
    title: "Conference",
    start: new Date(2023, 10, 5),
    end: new Date(2023, 10, 7),
  },
];

const Calendar: React.FC = () => {
  const [view, setView] = useState("month");
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleCreateEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
    handleCloseModal();
  };

  return (
    <div className="h-[600px] w-full max-w-4xl mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-gray-500 border border-gray-300 rounded-lg shadow-lg">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view as any}
        onView={(newView) => setView(newView)}
        selectable
        onSelectSlot={handleSelectSlot}
      />
      {selectedSlot && (
        <NewEventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreateEvent={handleCreateEvent}
          startDate={selectedSlot.start}
          endDate={selectedSlot.end}
        />
      )}
    </div>
  );
};

export default Calendar;
