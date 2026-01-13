export interface Student {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  studentId: string;
  dob: string;
  state: string;
  city: string;
  college: string;
  address: string;
  isActive: boolean;
  subscribed: boolean;
  createdAt: string;
}

export interface StudentListResponse {
  success: boolean;
  data: {
    students: Student[];
    pagination: {
      current: number;
      total: number;
      count: number;
      limit: number;
    };
  };
}

export interface StudentDetailsResponse {
  success: boolean;
  data: {
    student: Student;
    stats: {
      totalCourses: number;
      completedCourses: number;
      inProgressCourses: number;
      avgRating: number;
    };
  };
}
