import { Student } from "@/types/student";

export default function StudentTable({
  students,
  onEdit,
  onDelete,
}: {
  students: Student[];
  onEdit: (s: Student) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="border border-white/10 rounded-[8px] overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-sm">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Student ID</th>
            <th className="px-4 py-3">Subscribed</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr
              key={s._id}
              className="border-t border-white/5 hover:bg-white/5 text-sm"
            >
              <td className="px-4 py-3 font-medium">{s.name}</td>
              <td className="px-4 py-3 text-white/70">{s.email}</td>
              <td className="px-4 py-3">{s.phoneNumber}</td>
              <td className="px-4 py-3">{s.studentId}</td>
              <td className="px-4 py-3">
                {s.subscribed ? (
                  <span className="text-green-400">Yes</span>
                ) : (
                  <span className="text-red-400">No</span>
                )}
              </td>
              <td className="px-4 py-3 text-right space-x-3">
                {/* <button
                  onClick={() => onEdit(s)}
                  className="text-blue-400 hover:underline"
                >
                  Edit
                </button> */}
                <button
                  onClick={() => onDelete(s._id)}
                  className="text-red-400 hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
