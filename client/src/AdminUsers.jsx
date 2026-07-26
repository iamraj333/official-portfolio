import { useContext, useEffect, useState } from "react"
import { ContextAPIData } from "./ContextData/ContentAPIData";
import Swal from "sweetalert2";
import Loading from "./Loading";

export default function AdminUser() {
  const { userToken, adminToken } = useContext(ContextAPIData);
  const [adminUser, setAdminUser] = useState([]);
  const [isInternet, setIsInternet] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  };

  const getAllUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/users`, {
        method: "GET",
        headers: {
          token: adminToken
        }
      })

      const data = await response.json()
      if (data.internetError) {
        setIsInternet(false)
      }
      setAdminUser(data.allUserData);
    }
    catch (e) {
      console.error("Something went wrong in getAlluser ")
      showToast("error","Something went wrong in getAlluser")
    }

  }

  useEffect(() => {
    getAllUser()
  }, [])



  const handleDelete = async (userId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          token: adminToken
        }
      })


      const data = await response.json();

      if (data.internetError) {
        showToast("error", data.internetError)
      }
      else {
        if (data.success) {
          showToast('success', `${data.success}`)
          getAllUser();
        }
        if (data.adminTokenExpire) {
          localStorage.removeItem('AdminToken')
        }
      }
    }
    catch (e) {
      console.error("Something went wrong in handle delete")
      showToast("error","Something went wrong in handle delete")
    }
    finally {
      setIsLoading(false)
    }
  }

  if (!adminToken) {
    return <Navigate to={"/admin/login"} state={{ warning: "Loggin to access admin panel" }}></Navigate>
  }

  return (
    <>
      {
        isLoading && <Loading />
      }
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Our Users</h2>

          <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
            Total: {isInternet ? adminUser.length : 0}
          </span>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Email</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-zinc-300">Actions</th>
              </tr>
            </thead>

            <tbody>
              {
                isInternet ? (
                  <>
                    {(adminUser.length > 0) ? (
                      adminUser.map((user, index) => (
                        <tr key={user._id} className="border-t border-zinc-800 hover:bg-zinc-900 transition-colors">
                          <td className="px-6 py-4 text-zinc-400">{index + 1}</td>
                          <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                          <td className="px-6 py-4 text-zinc-400">{user.email}</td>

                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-3">
                              <button
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                                onClick={() => handleDelete(user._id)}>Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-zinc-500">No users found.</td>
                      </tr>
                    )}
                  </>
                ):(<tr>
                        <td colSpan="4" className="py-8 text-center text-zinc-500">No Internet Connection</td>
                      </tr>)
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}