"use client";

import { useRoomStore } from "@/store/useRoomStore";
import StudentControls from "./controls/StudentControls";
import HostControls from "./controls/HostControls";

const MeetingControlBar = () => {
  const role = useRoomStore((s) => s.role);

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-black/60 backdrop-blur border-t border-white/10 p-3">
      {role === "participant" ? <StudentControls /> : <HostControls />}
    </div>
  );
};

export default MeetingControlBar;
