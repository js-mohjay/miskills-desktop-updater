// routes/student.onboard.tsx
import StudentShell from "@/pages/student/StudentShell";
import OnboardStudent from "@/pages/student/OnboardStudent";

export const studentOnboardRoute = {
  element: <StudentShell />,
  children: [
    { path: "onboard", element: <OnboardStudent /> }
  ],
};
