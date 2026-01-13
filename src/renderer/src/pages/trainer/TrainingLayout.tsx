// pages/trainer/TrainingLayout.tsx
import { Outlet } from "react-router";

export default function TrainingLayout() {
  return (
    <div className="p-4">
      {/* future trainer navbar / sidebar */}
      <Outlet />
    </div>
  );
}
