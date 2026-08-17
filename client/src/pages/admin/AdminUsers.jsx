import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { formatDate } from "../../utils/format.js";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/users").then((res) => {
      setUsers(res.data.data.users);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const changeRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    load();
  };

  const toggleStatus = async (id) => {
    await api.put(`/admin/users/${id}/status`);
    load();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif mb-8">Customers</h1>
      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-white/40 text-xs border-b border-white/10">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Registered</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-white/5">
                <td className="p-4">{u.name}</td>
                <td className="p-4 text-white/70">{u.email}</td>
                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="bg-white/5 border border-white/10 px-2 py-1 text-xs"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-4 text-white/70">{formatDate(u.createdAt)}</td>
                <td className="p-4">
                  <span className={u.isActive ? "text-green-400" : "text-wine"}>
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => toggleStatus(u._id)} className="text-xs underline text-white/70">
                    {u.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && users.length === 0 && (
          <p className="p-8 text-center text-white/40 text-sm">No users found.</p>
        )}
      </div>
    </div>
  );
}
