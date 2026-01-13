import StudentLayout from "@/pages/student/StudentLayout"
import StudentDashboard from "@/pages/student/Dashboard"
import Courses from "@/pages/student/Courses"
import Learning from "@/pages/student/Learning/Learning"
import Placements from "@/pages/student/Placements"
import Profile from "@/pages/student/Profile"

// import StudentMeetingRoom from "@/pages/meeting/MeetingRoom";
import LearningDetails from "@/pages/student/Learning/LearningDetails"
import StudentMeetings from "@/pages/student/StudentMeetings"

export const studentRoutes = {
  path: "student",
  Component: StudentLayout,
  children: [
    { index: true, Component: StudentDashboard },
    { path: "courses", Component: Courses },
    
    // Learning
    { path: "learning", Component: Learning },
    { path: "learning/:subcategoryId", Component: LearningDetails },

    { path: "placements", Component: Placements },
    { path: "profile", Component: Profile },
    { path: "meetings", Component: StudentMeetings },
    // { path: "meetings/room", Component: StudentMeetingRoom }
  ],
};
