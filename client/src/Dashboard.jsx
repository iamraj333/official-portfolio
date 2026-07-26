import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ContextAPIData } from "./ContextData/ContentAPIData";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import ContactMessages from "./ContactMessages";
import NormalMessages from "./NormalMessages";
import Swal from "sweetalert2";
import { FaCross } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { IoEyeOutline } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { GoArrowRight, GoComment } from "react-icons/go";
import NoInternet from "./NoInternet";

export default function Dashboard() {
    const { currentUser, isLoading, userToken, adminToken } = useContext(ContextAPIData)
    const [adminMessages, setAdminMessages] = useState([]);
    const [normalMessage, setNormalMessage] = useState([])
    const [DeleteLoad, setDeleteLoad] = useState(false)
    const [blogContent, setBlogContent] = useState([])
    const [isInternet, setIsInternet] = useState(true)
    const [fetchLoading, setFetchLoading] = useState(false)

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

    const getAllContactMessage = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/${adminToken ? "admin" : "user"}/messages`, {
                method: "GET",
                headers: {
                    token: userToken
                }
            })

            const data = await response.json()

            if (data.internetError) {
                setIsInternet(false)
            }
            else {
                if (data.userTokenExpireError) {
                    localStorage.removeItem("MyToken")
                }
                else {
                    setAdminMessages(data.allMessages);
                }
            }
        }
        catch (e) {
            console.error("Failed to connect server ")
        }

    }

    const getNormalMessage = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/${adminToken ? "admin" : "user"}/messages/normal`, {
                method: "GET",
                headers: {
                    token: userToken
                }
            })

            const data = await response.json()
            if (data.internetError) {
                setIsInternet(false)
            }
            else {
                if (data.userTokenExpireError) {
                    localStorage.removeItem("MyToken")
                }
                else {
                    setNormalMessage(data.allMessages);

                }
            }

        }
        catch (e) {
            console.error("Failed to connect server ")
        }

    }

    useEffect(() => {
        if (!userToken) return
        getNormalMessage()
        getAllContactMessage()
    }, [userToken])

    // Deleting contact messages function
    const DeleteContactHandler = async (e, ContactId) => {
        e.preventDefault();
        setDeleteLoad(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/dashboard/contact/delete/${ContactId}`, {
                method: 'DELETE',
                headers: {
                    token: userToken
                }
            })

            const data = await response.json();
            if (data.internetError) {
                showToast("error", data.internetError)
            }
            else {
                if (data.userTokenExpireError) {
                    localStorage.removeItem('AdminToken')
                }
                if (data.success) {
                    showToast("success", data.success)
                    getAllContactMessage()
                }
                else {
                    showToast("error", data.error)
                }

            }
        }
        catch (e) {
            console.error("Failed to communicate server")
        }
        finally {
            setDeleteLoad(false)
        }
    }

    //Deleting normal messages function
    const DeleteMessageHandler = async (e, messageId) => {
        e.preventDefault();
        setDeleteLoad(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/dashboard/message/delete/${messageId}`, {
                method: 'DELETE',
                headers: {
                    token: userToken
                }
            })

            const data = await response.json();
            if (data.internetError) {
                showToast("error", data.internetError)
            }
            else {
                if (data.userTokenExpireError) {
                    localStorage.removeItem('MyToken')
                }
                if (data.internetError) {
                    showToast("error", data.internetError)
                }
                if (data.success) {
                    showToast("success", data.success)
                    getNormalMessage()
                }
                else {
                    showToast("error", data.error)
                }

            }
        }
        catch (e) {
            console.error("Failed to communicate server")
        }
        finally {
            setDeleteLoad(false)
        }
    }

    //Fetching blog data
    const FetchBlogContentFunction = async () => {
        setFetchLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/blogs`, {
                method: "GET",
            })

            const data = await response.json()
            if (data.internetError) {
                setIsInternet(false)
            }
            if (response.ok) {
                setBlogContent(data)
            }
        }
        catch (e) {
            console.error("Failed to connect server ")
        }
        finally {
            setFetchLoading(false)
        }
    }

    useEffect(() => {
        FetchBlogContentFunction()
    }, [])

    let currentNormalMessage = [];
    let currentContactMessage = [];
    let allComments = [];
    let allLikedBlog = [];

    if (isInternet) {
        if (!isLoading && !currentUser && !adminToken) {
            return <Navigate to={"/login"} state={{ warning: "Login to access dashboard" }} />
        }

        currentNormalMessage = normalMessage.filter((message) => message.email == currentUser.email)
        currentContactMessage = adminMessages.filter((message) => message.email == currentUser.email)

        blogContent.map((blog) => (
            blog.comments.map((comment) => {
                if (comment?.user?._id === currentUser?._id) {
                    allComments.push(comment)
                }
            })
        ))

        blogContent.map(blog => (
            blog.likes.map((like) => {
                if (like?._id === currentUser?._id) {
                    allLikedBlog.push(like)
                }
            })
        ))
    }


    //finding title of blog with their comment id
    const checkBlogTitle = (commentId) => {
        let blogtitle = blogContent.find((blog) => (
            blog.comments.some((item) => item?._id === commentId)
        ))
        return blogtitle
    }


    //finding the blog liked by user
    let blogLikedByUser = blogContent.filter((blog) => blog.likes.some(like => like._id == currentUser._id))

    //handling the comment delete button
    const DeleteComment = async (e, commentId) => {
        e.preventDefault();
        setDeleteLoad(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/dashboard/comment/delete/${commentId}`, {
                method: 'DELETE',
                headers: {
                    token: userToken
                }
            })

            const data = await response.json()

            if (data.internetError) {
                showToast("error", data.internetError)
            }
            else {
                if (data.userTokenExpireError) {
                    localStorage.removeItem('MyToken')
                }
                if (data.success) {
                    showToast("success", data.success)
                    FetchBlogContentFunction()
                }
                else {
                    showToast("error", data.error)
                }
            }
        }
        catch (e) {
            console.error("Failed to connect server")
        }
        finally {
            setDeleteLoad(false)
        }
    }

    return (
        <>
            {
                (isLoading || DeleteLoad || fetchLoading) && <Loading />
            }

            <Navbar />

            {
                isInternet ? (
                    <div className="min-h-screen bg-[#0b0f17] text-white py-6 sm:py-8 lg:py-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                            {/* HEADER */}
                            <div className="mb-10">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                                    Welcome Back,{" "}
                                    <span className="text-[#3b82f6]">
                                        {currentUser ? currentUser.name : "User"}
                                    </span>
                                </h1>

                                <p className="text-gray-400 mt-2 text-sm sm:text-base">
                                    Manage your courses, products, collaborations and messages.
                                </p>
                            </div>

                            {/* STATS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

                                <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                                    <h3 className="text-gray-400 text-sm">Total Messages</h3>
                                    <p className="text-2xl sm:text-3xl font-bold mt-2">
                                        {currentContactMessage.length + currentNormalMessage.length}
                                    </p>
                                </div>

                                <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                                    <h3 className="text-gray-400 text-sm">Collaboration</h3>
                                    <p className="text-2xl sm:text-3xl font-bold mt-2">0</p>
                                </div>

                                <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                                    <h3 className="text-gray-400 text-sm">Comments</h3>
                                    <p className="text-2xl sm:text-3xl font-bold mt-2">
                                        {allComments.length || 0}
                                    </p>
                                </div>

                                <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                                    <h3 className="text-gray-400 text-sm">Liked Blogs</h3>
                                    <p className="text-2xl sm:text-3xl font-bold mt-2">
                                        {allLikedBlog.length || 0}
                                    </p>
                                </div>

                            </div>

                            {/* YOUR MESSAGES */}
                            <div className="py-6 lg:py-10">

                                <h1 className="text-2xl sm:text-3xl font-bold mb-8">
                                    Your Messages
                                </h1>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">

                                    {/* CONTACT MESSAGE */}
                                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 sm:p-6">

                                        <div className="flex justify-between items-center mb-5">
                                            <h2 className="text-lg sm:text-xl font-semibold">
                                                Contact Messages
                                            </h2>

                                            <span className="bg-[#3b82f6]/10 text-[#60a5fa] px-3 py-1 rounded-md text-sm">
                                                {currentContactMessage?.length || 0}
                                            </span>
                                        </div>

                                        <div className="space-y-4">

                                            {currentContactMessage?.length ? (
                                                currentContactMessage.map((contact) => (
                                                    <div
                                                        key={contact._id}
                                                        className="border border-gray-800 rounded-lg p-4 hover:border-[#3b82f6] transition-colors"
                                                    >

                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                                                            <p className="text-xs text-gray-500">
                                                                {new Date(contact.createdAt).toLocaleDateString(
                                                                    "en-IN",
                                                                    {
                                                                        day: "numeric",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    }
                                                                )}
                                                            </p>

                                                            <button
                                                                onClick={(e) =>
                                                                    DeleteContactHandler(e, contact._id)
                                                                }
                                                                className="bg-blue-500/80 hover:bg-blue-500 rounded-full px-3 py-1 text-sm transition"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                        <h3 className="text-lg font-medium mt-3">
                                                            {contact.subject}
                                                        </h3>

                                                        <p className="text-gray-400 text-sm mt-2 break-words">
                                                            {contact.message}
                                                        </p>

                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-500 py-6">
                                                    No Contact Messages
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                    {/* NORMAL MESSAGE */}
                                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 sm:p-6">

                                        <div className="flex justify-between items-center mb-5">
                                            <h2 className="text-lg sm:text-xl font-semibold">
                                                Normal Messages
                                            </h2>

                                            <span className="bg-[#3b82f6]/10 text-[#60a5fa] px-3 py-1 rounded-md text-sm">
                                                {currentNormalMessage?.length || 0}
                                            </span>
                                        </div>

                                        <div className="space-y-4">

                                            {currentNormalMessage?.length ? (
                                                currentNormalMessage.map((normal) => (
                                                    <div
                                                        key={normal._id}
                                                        className="border border-gray-800 rounded-lg p-4 hover:border-[#3b82f6] transition-colors"
                                                    >

                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                                                            <p className="text-xs text-gray-500">
                                                                {new Date(normal.createdAt).toLocaleDateString(
                                                                    "en-IN",
                                                                    {
                                                                        day: "numeric",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    }
                                                                )}
                                                            </p>

                                                            <button
                                                                onClick={(e) =>
                                                                    DeleteMessageHandler(e, normal._id)
                                                                }
                                                                className="bg-blue-500/80 hover:bg-blue-500 rounded-full px-3 py-1 text-sm transition"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                        <h3 className="text-lg font-medium mt-3">
                                                            {normal.subject}
                                                        </h3>

                                                        <p className="text-gray-400 text-sm mt-2 break-words">
                                                            {normal.message}
                                                        </p>

                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-500 py-6">
                                                    No Messages
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* BLOG COMMENTS */}
                            <div className="mt-10">

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                                    <h1 className="text-2xl sm:text-3xl font-bold">
                                        Blog Comments
                                    </h1>

                                    <span className="bg-[#3b82f6]/10 text-[#60a5fa] px-3 py-1 rounded-md text-sm">
                                        Comments: {allComments?.length || 0}
                                    </span>

                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                                    {allComments?.length > 0 ? (
                                        allComments.map((comment) => (
                                            <div
                                                key={comment._id}
                                                className="border border-gray-800 rounded-lg p-4 hover:border-[#3b82f6] transition-colors"
                                            >

                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                                                    <p className="text-xs text-gray-500">
                                                        {new Date(comment.createdAt).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </p>

                                                    <button
                                                        onClick={(e) =>
                                                            DeleteComment(e, comment._id)
                                                        }
                                                        className="bg-blue-500/80 hover:bg-blue-500 rounded-full px-3 py-1 text-sm transition"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                                <p className="text-white font-medium mt-3 break-words">
                                                    {comment.content}
                                                </p>

                                                <p className="text-sm text-gray-400 mt-2">
                                                    {checkBlogTitle(comment._id).title}
                                                </p>

                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 col-span-full py-6">
                                            No Blog Comments
                                        </p>
                                    )}

                                </div>

                            </div>

                            {/* LIKED BLOG */}
                            <div className="mt-10">

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                                    <h1 className="text-2xl sm:text-3xl font-bold">
                                        Liked Blog
                                    </h1>

                                    <span className="bg-[#3b82f6]/10 text-[#60a5fa] px-3 py-1 rounded-md text-sm">
                                        Total: {allLikedBlog?.length || 0}
                                    </span>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                                    {blogLikedByUser?.length > 0 ? (
                                        blogLikedByUser.map((blog) => (
                                            <div
                                                key={blog._id}
                                                className="group flex flex-col justify-between border border-gray-800 bg-[#0b0f17] rounded-xl p-5 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                                            >

                                                <div>

                                                    <h2 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-400 transition">
                                                        {blog.title}
                                                    </h2>

                                                    <p className="text-sm text-zinc-400 mt-3 line-clamp-3">
                                                        {blog.excerpt}
                                                    </p>

                                                </div>

                                                <div className="flex justify-between items-center mt-5 text-sm text-zinc-400">

                                                    <div className="flex items-center gap-1">
                                                        <IoEyeOutline className="text-blue-400" />
                                                        <span>{blog?.views || 0}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <FcLike />
                                                        <span>{blog?.likes?.length || 0}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <GoComment className="text-green-400" />
                                                        <span>{blog?.comments?.length || 0}</span>
                                                    </div>

                                                </div>

                                                <Link
                                                    to={`/blogs/read/${blog._id}`}
                                                    className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                                                >
                                                    Read More
                                                    <GoArrowRight />
                                                </Link>

                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-10 col-span-full">
                                            No Liked Blog
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>
                    </div>
                ) : (
                    <NoInternet />
                )
            }

            <Footer />
        </>
    );
}