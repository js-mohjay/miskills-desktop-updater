// routes/training.routes.tsx
import TrainingAdminLayout from "@/pages/trainer/TrainingLayout";
import Batches from "@/pages/admin/Batches";
import Instructors from "@/pages/admin/Instructors";

export const trainingAppRoute = {
  path: "training-admin",
  Component: TrainingAdminLayout,
  children: [
    { index: true, Component: Batches },
    { path: "instructors", Component: Instructors },
  ],
};
