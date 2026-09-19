import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { FaRegCalendarAlt, FaGoogle, FaMicrosoft, FaClock } from "react-icons/fa";
import "./customCalendar.css";
import { Card, CardContent } from "@/components/ui/card";

const meetingData = [
  {
    date: "Feb 7, 2025",
    title: "Interview with Amazon",
    time: "5:00 AM",
    type: "Technical Round",
  },
  {
    date: "Feb 8, 2025",
    title: "Mock Interview Practice",
    time: "7:00 PM",
    type: "Flavor: Behavioral",
  },
  {
    date: "Feb 10, 2025",
    title: "Resume Review Session",
    time: "12:00 PM",
    type: "Feedback",
  },
];

const MeetingsShowcase = () => {
  const [date, setDate] = useState(new Date());

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
                Stay on top of your <span className="text-primary">schedule</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Never miss an interview or preparation session. Our smart calendar integrates with your favorite tools to keep you organized.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
                  <FaGoogle className="text-red-500" /> <span>Google Calendar</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
                  <FaMicrosoft className="text-blue-500" /> <span>Outlook</span>
                </div>
              </div>

              {/* Upcoming Meetings List */}
              <div className="mt-12 space-y-4 text-left">
                <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                {meetingData.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <FaRegCalendarAlt size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><FaClock size={12} /> {item.time}</span>
                        <span>•</span>
                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Interactive Calendar Visual */}
          <div className="lg:w-1/2 flex justify-center">
            <Tilt
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              perspective={1000}
              transitionSpeed={1500}
              scale={1.02}
              gyroscope={true}
              className="w-full max-w-md"
            >
              <motion.div
                className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-2xl relative gradient-border"
                initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-tint blur-3xl rounded-full" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold font-heading">Calendar</h3>
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Live Sync</div>
                  </div>

                  <Calendar
                    onChange={setDate}
                    value={date}
                    className="custom-calendar-styles w-full border-none bg-transparent"
                    tileClassName="rounded-lg hover:bg-primary/20 transition-colors"
                  />

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Selected Date</span>
                      <span className="font-semibold bg-secondary px-3 py-1 rounded-md">{date.toDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Tilt>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MeetingsShowcase;
