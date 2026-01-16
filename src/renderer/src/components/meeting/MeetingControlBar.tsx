"use client";

import { useRoomStore } from "@/store/useRoomStore";
import StudentControls from "./controls/StudentControls";
import HostControls from "./controls/HostControls";
import { useAuth } from "@/store/auth/useAuthStore";

const MeetingControlBar = () => {
  const role = useRoomStore((s) => s.role);
  // console.log(
  //   "meeting role from useRoomStore: ", role
  // )

  const {user} = useAuth()
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-black/60 backdrop-blur border-t border-white/10 p-3">
      {(role === "participant" || user?.role === "student") ? <StudentControls /> : <HostControls />}
    </div>
  );
};

export default MeetingControlBar;
