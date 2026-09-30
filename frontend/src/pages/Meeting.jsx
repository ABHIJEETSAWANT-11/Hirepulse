import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./customCalendar.css";
import { CalendarDays, Clock } from "lucide-react";

const meetingData = [
  {
    date: "Mon, Feb 7",
    title: "Interview with Amazon",
    time: "10:00 AM",
    type: "Technical round",
  },
  {
    date: "Tue, Feb 8",
    title: "Mock interview practice",
    time: "5:00 PM",
    type: "Behavioral",
  },
  {
    date: "Thu, Feb 10",
    title: "Resume review session",
    time: "12:00 PM",
    type: "Feedback",
  },
];

const MeetingsShowcase = () => {
  const [date, setDate] = useState(new Date());

  return (
    <section id="scheduler" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Copy + upcoming events */}
          <div>
            <p className="text-eyebrow text-black/40">Scheduler</p>
            <h2 className="text-display mt-4 text-[36px] font-bold leading-[0.95] text-ink md:text-[48px]">
              Stay on top of your schedule
            </h2>
            <p className="mt-4 max-w-[460px] text-[15px] leading-relaxed text-black/60">
              Never miss an interview or preparation session. Track every round,
              deadline, and practice block in one place.
            </p>

            {/* TODO: these chips become real once Google/Outlook sync ships — labeled as planned until then */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-black/40">
                Planned integrations
              </span>
              <span className="pill-meta">Google Calendar</span>
              <span className="pill-meta">Outlook</span>
            </div>

            <div className="mt-10">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-black/40">
                Upcoming events
              </h3>
              <div className="mt-4 space-y-3">
                {meetingData.map((item) => (
                  <div
                    key={item.title}
                    className="card-real card-real-hover flex items-center gap-4 p-4"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-black/5 text-ink">
                      <CalendarDays size={15} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-semibold text-ink">{item.title}</h4>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-black/50">
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {item.time}
                        </span>
                        <span className="text-black/20">•</span>
                        <span>{item.type}</span>
                      </div>
                    </div>
                    <span className="ml-auto hidden flex-shrink-0 text-[11px] text-black/40 sm:block">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar card */}
          <div className="flex justify-center">
            <div className="card-real w-full max-w-md p-6 md:p-7">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-ink">Calendar</h3>
                <span className="pill-meta">Coming soon</span>
              </div>

              <Calendar
                onChange={setDate}
                value={date}
                className="custom-calendar-styles w-full border-none bg-transparent"
                tileClassName="rounded-lg transition-colors"
              />

              <div className="mt-6 border-t border-black/5 pt-5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-black/50">Selected date</span>
                  <span className="rounded-lg bg-[#F7F8FA] px-3 py-1 font-semibold text-ink">
                    {date.toDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingsShowcase;
