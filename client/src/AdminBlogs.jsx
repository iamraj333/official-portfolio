import { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ContextAPIData } from "./ContextData/ContentAPIData";
import { useState } from "react";
import Swal from "sweetalert2";
import Loading from "./Loading";

const AdminBlogs = () => {
    const { blogContent, adminToken } = useContext(ContextAPIData);
    const [isLoading, setIsLoading] = useState(false)
    const [isInternet, setIsInternet] = useState(true)

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


    const handleDelete = async (blogId, e) => {
        setIsLoading(true);
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/blogs/delete/${blogId}`, {
                method: 'DELETE',
                headers: {
                    token: adminToken
                }
            })

            const data = await response.json();
            if (data.internetError) {
                setIsInternet(false)
                showToast("error", data.internetError)
            }
            else {
                if (data.success) {
                    showToast('success', data.success)
                }

                if (data.adminTokenExpire) {
                    localStorage.removeItem('AdminToken')
                }
            }
        }
        catch (e) {
            console.error("Failed in server communication")
            showToast("error", "Failed in server communication")
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {
                isLoading && <Loading />
            }
            <div className="w-full">
                <div className="flex items-center justify-between mb-8">

                    <h2 className="text-3xl font-bold text-white">
                        Blogs
                    </h2>

                    <div className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        Total: {isInternet ? blogContent.length : 0}
                    </div>
                </div>

                <div className="mt-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-1 xl:grid-cols-1">
                        {
                            isInternet ? (
                                (blogContent.length > 0) ? (
                                    [...blogContent].reverse().map((blog) => (
                                        <div
                                            key={blog._id}
                                            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                                        >
                                            {/* Header */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-lg font-semibold text-white">
                                                        {blog.title}
                                                    </h3>

                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                        <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                                                            {blog.category}
                                                        </span>

                                                        <span
                                                            className={`rounded-md px-2.5 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-400"`}
                                                        >
                                                            Published
                                                        </span>
                                                    </div>
                                                </div>

                                                <span className="shrink-0 rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                                                    {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <p className="mt-4 line-clamp-3 text-sm leading-7 text-zinc-400">
                                                {blog.excerpt}
                                            </p>

                                            {/* Stats */}
                                            <div className="mt-5 flex flex-wrap gap-4 border-t border-zinc-800 pt-4 text-sm text-zinc-500">
                                                <span>👁 {blog?.views ||0} Views</span>
                                                <span>❤️ {blog.likes.length || 0} Likes</span>
                                                <span>💬 {blog.comments.length || 0} Comments</span>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-5 flex flex-wrap justify-end gap-2">
                                                <Link to={`/blogs/read/${blog._id}`} className="rounded-lg border border-blue-500 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500 hover:text-white">
                                                    View
                                                </Link>

                                                <Link to={`/admin/blogs/edit/${blog._id}`} className="rounded-lg border border-amber-500 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500 hover:text-black">
                                                    Edit
                                                </Link>

                                                <button onClick={(e) => handleDelete(blog._id, e)} className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full rounded-xl border border-dashed border-zinc-700 bg-zinc-900 py-20 text-center">
                                        <div className="text-5xl">📝</div>
                                        <h3 className="mt-4 text-lg font-semibold text-white">
                                            No Blogs Found
                                        </h3>
                                        <p className="mt-2 text-sm text-zinc-500">
                                            Create your first blog to see it here.
                                        </p>
                                    </div>
                                )
                            ) : (
                                <div className="col-span-full rounded-xl border border-dashed border-zinc-700 bg-zinc-900 py-20 text-center">
                                    <div className="text-5xl">📡</div>
                                    <h3 className="mt-4 text-lg font-semibold text-white">
                                        No Internet Connectivity
                                    </h3>
                                    <p className="mt-2 text-sm text-zinc-500">
                                        Please connecte system with internet.
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div >
        </>
    );
};

export default AdminBlogs;