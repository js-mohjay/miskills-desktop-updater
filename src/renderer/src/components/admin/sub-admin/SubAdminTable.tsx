import { SubAdmin } from "@/types/subAdmin";

export default function SubAdminTable({
  admins,
  onEdit,
  onDelete,
}: {
  admins: SubAdmin[];
  onEdit: (a: SubAdmin) => void;
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
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Created</th>
            {/* <th className="px-4 py-3 text-right">Actions</th> */}
          </tr>
        </thead>

        <tbody>
          {admins.map((a) => (
            <tr
              key={a._id}
              className="border-t border-white/5 text-sm hover:bg-white/5"
            >
              <td className="px-4 py-3 font-medium">{a.name}</td>
              <td className="px-4 py-3 text-white/70">{a.email}</td>
              <td className="px-4 py-3">{a.phoneNumber}</td>
              <td className="px-4 py-3 capitalize">{a.role}</td>
              <td className="px-4 py-3 text-white/60">
                {new Date(a.createdAt).toLocaleDateString()}
              </td>
              {/* <td className="px-4 py-3 text-right space-x-3">
                <button
                  onClick={() => onEdit(a)}
                  className="text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(a._id)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
