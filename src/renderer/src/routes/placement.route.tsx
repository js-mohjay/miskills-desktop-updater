// routes/training.routes.tsx
import CareerSupport from "@/pages/admin/CareerSupport";
import JobApplications from "@/pages/admin/JobApplications";
import PlacementAdminLayout from "@/pages/placement/PlacementLayout";

export const placementAppRoute = {
  path: "placement-admin",
  Component: PlacementAdminLayout,
  children: [
    // { index: true, Component: PlacementAdminDashboard },
    { index: true, Component: JobApplications },
    { path: "career-support", Component: CareerSupport },
  ],
};
