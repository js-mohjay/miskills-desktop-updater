import AdminLayout from "@/pages/admin/AdminLayout"
import AdminManagement from "@/pages/admin/AdminManagement"
import Batches from "@/pages/admin/Batches"
import CareerSupport from "@/pages/admin/CareerSupport"
import Categories from "@/pages/admin/Categories"
import Dashboard from "@/pages/admin/Dashboard"
import Instructors from "@/pages/admin/Instructors"
import JobApplications from "@/pages/admin/JobApplications"
import MissedClasses from "@/pages/admin/MissedClasses"
import StudentManagement from "@/pages/admin/StudentManagement"

export const adminAppRoute = {
  path: "admin",
  Component: AdminLayout,
  children: [
    { index: true, Component: Dashboard },
    { path: "admin-management", Component: AdminManagement },
    { path: "student-management", Component: StudentManagement },
    { path: "job-applications", Component: JobApplications },
    { path: "career-support", Component: CareerSupport },
    { path: "instructors", Component: Instructors },
    { path: "batches", Component: Batches },
    { path: "categories", Component: Categories },
    { path: "missed-classes", Component: MissedClasses },
  ],
}
