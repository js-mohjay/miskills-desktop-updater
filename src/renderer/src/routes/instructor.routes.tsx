import InstructorLayout from "@/pages/instructor/InstructorLayout";
import InstructorMeetings from "@/pages/instructor/InstructorMeetings";

export const instructorAppRoute = {
  path: "instructor",
  Component: InstructorLayout,
  children: [
    // { index: true, Component: PlacementAdminDashboard },
    {
      // path: "placements",
      index: true,
      Component: InstructorMeetings,
    },
  ],
};
