// router.tsx
import { createBrowserRouter, createHashRouter } from "react-router";
import { AuthGuard } from "@/components/guards/AuthGuard";

import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import NotFound from "@/pages/NotFound";

import { studentRoutes } from "@/routes/students/student.routes";
import { studentOnboardRoute } from "@/routes/students/student.onboard";
import { adminAppRoute } from "@/routes/admin.routes";
import { trainingAppRoute } from "@/routes/training.routes";

import RootRedirect from "@/components/RootRedirector";
import { OnboardGuard } from "@/components/guards/OnboardGuard";
import { SubscriptionGuard } from "@/components/guards/SubscriptionGuard";
import { NoSubscriptionGuard } from "@/components/guards/NoSubscriptionGuard";
import Categories from "@/pages/student/Plans";
import EmployeeSignIn from "@/pages/auth/EmployeeSignIn";

import { placementAppRoute } from "@/routes/placement.route";
import MeetingRoom from "@/pages/meeting/MeetingRoom";
import { instructorAppRoute } from "./instructor.routes";

export const router = createHashRouter([
  {
    path: "/",
    Component: RootRedirect,
  },

  /* 🔓 SHARED MEETING ROOM (ANY LOGGED-IN USER) */
  {
    element: <AuthGuard />, // ✅ no role
    children: [
      {
        path: "/meetings/room",
        Component: MeetingRoom,
      },
    ],
  },

  // STUDENT
  {
    element: <AuthGuard role="student" />,
    children: [
      // onboarding allowed only once
      {
        element: <OnboardGuard />,
        children: [studentOnboardRoute],
      },

      // Categories: student only, but no subscription yet
      {
        element: <NoSubscriptionGuard />,
        children: [
          { path: "/plans", element: <Categories /> },
        ],
      },

      // actual app: requires active subscription
      {
        element: <SubscriptionGuard />,
        children: [studentRoutes],
      },
    ],
  },


  // ADMIN
  {
    element: <AuthGuard role="admin" />,
    children: [
      adminAppRoute,
    ],
  },

  // TRAINING
  {
    element: <AuthGuard role="training" />,
    children: [
      trainingAppRoute,
    ],
  },

  // PLACEMENT
  {
    element: <AuthGuard role="placement" />,
    children: [
      placementAppRoute,
    ],
  },

   // INSTRUCTOR
  {
    element: <AuthGuard role="instructor" />,
    children: [
      instructorAppRoute,
    ],
  },

  // PUBLIC
  { path: "/signin", element: <SignIn /> },
  { path: "/employee-signin", element: <EmployeeSignIn /> },
  { path: "/signup", element: <SignUp /> },

  { path: "*", element: <NotFound /> },
]);
