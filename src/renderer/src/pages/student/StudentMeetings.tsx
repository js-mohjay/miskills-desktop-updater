"use client";

import MeetingsList from "@/components/meeting/MeetingsList";



const StudentMeetings = () => {
  return (
    <section className="w-full p-10 space-y-6!">
      <h1 className="text-5xl mb-4">
        My Meetings
      </h1>

      <MeetingsList />
    </section>
  );
};

export default StudentMeetings;
