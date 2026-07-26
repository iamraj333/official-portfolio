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
                    <div className="min-h-screen bg-[#0b0f17] text-white py-10 px-4">

                        {/* HEADER */}
                        <div className="max-w-6xl mx-auto mb-10">
                            <h1 className="text-4xl font-bold">
                                Welcome Back, <span className="text-[#3b82f6]">{currentUser ? currentUser?.name : "User"}</span>
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Manage your courses, products, collaborations and messages.
                            </p>
                        </div>

                        {/* STATS */}
                        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-5 mb-10">

                            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                                <h3 className="text-gray-400 text-sm">Total Message</h3>
                                <p className="text-3xl font-bold mt-2">{currentContactMessage.length + currentNormalMessage.length}</p>
                            </div>

                            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                                <h3 className="text-gray-400 text-sm">Colloboration</h3>
                                <p className="text-3xl font-bold mt-2">0</p>
                            </div>

                            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                                <h3 className="text-gray-400 text-sm">Comments</h3>
                                <p className="text-3xl font-bold mt-2">{allComments.length || 0}</p>
                            </div>

                            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
                                <h3 className="text-gray-400 text-sm">Liked Blogs</h3>
                                <p className="text-3xl font-bold mt-2">{allLikedBlog.length || 0}</p>
                            </div>

                        </div>

                        {/* COLLABORATION + CONTACT */}
                        {/* COLLABORATION + CONTACT */}
                        <div className="max-w-6xl mx-auto px-4 py-10">

                            <h1 className="text-3xl font-bold text-white mb-8">
                                Your Messages
                            </h1>

                            <div className="grid gap-8 lg:grid-cols-2 items-start">

                                {/* Contact Messages */}
                                <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6">

                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-xl font-semibold text-white">
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
                                                    <div className="flex flex-wrap justify-between gap-2 items-center">
                                                        <p className="text-xs text-gray-500 mb-2">
                                                            {new Date(contact.createdAt).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </p>

                                                        <button onClick={(e) => DeleteContactHandler(e, contact._id)} className=" bg-blue-500/80 transition-all duration-200 hover:bg-blue-500/30 rounded-full hover:text-white p-1 text-sm px-3">Delete</button>
                                                    </div>

                                                    <h3 className="text-lg font-medium text-white mb-2">
                                                        {contact.subject}
                                                    </h3>

                                                    <p className="text-gray-400 text-sm">
                                                        {contact.message}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-6">
                                                No Contact Messages
                                            </p>
                                        )}

                                    </div>

                                </div>

                                {/* Normal Messages */}
                                <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6">

                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-xl font-semibold text-white">
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
                                                    <div className="flex justify-between items-centerflex-wrap gap-2">
                                                        <p className="text-xs text-gray-500 mb-2">
                                                            {new Date(normal.createdAt).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </p>

                                                        <button onClick={(e) => DeleteMessageHandler(e, normal._id)} className=" bg-blue-500/80 transition-all duration-200 hover:bg-blue-500/30 rounded-full hover:text-white p-1 text-sm px-3">Delete</button>
                                                    </div>

                                                    <h3 className="text-lg font-medium text-white mb-2">
                                                        {normal.subject}
                                                    </h3>

                                                    <p className="text-gray-400 text-sm">
                                                        {normal.message}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-6">
                                                No Messages
                                            </p>
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* BLOG COMMENTS */}
                        <div className="p-6 mt-10 max-w-6xl mx-auto">

                            <div className="flex justify-between items-center mb-5">
                                <h1 className="text-3xl font-bold text-white mb-8">
                                    Blog Comments
                                </h1>

                                <span className="bg-[#3b82f6]/10 text-[#60a5fa] px-3 py-1 rounded-md text-sm">
                                    Comments: {allComments?.length || 0}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4 items-center">

                                {allComments?.length > 0 ? (
                                    allComments.map((comment) => (
                                        <div
                                            key={comment._id}
                                            className="w-1/3 lg:w-[350px] border border-gray-800 rounded-lg p-4 hover:border-[#3b82f6] transition-colors"
                                        >
                                            <div className="flex flex-wrap justify-between gap-2 items-center">
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {new Date(comment.createdAt).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>

                                                <button onClick={(e) => DeleteComment(e, comment._id)} className=" bg-blue-500/80 transition-all duration-200 hover:bg-blue-500/30 rounded-full hover:text-white p-1 text-sm px-3">Delete</button>
                                            </div>

                                            <p className="text-white font-medium text-md">
                                                {comment.content}
                                            </p>
                                            <p className="text-sm text-gray-400/50  mt-1 mb-2">
                                                {
                                                    checkBlogTitle(comment._id).title
                                                }
                                            </p>


                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        No Blog Comments
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* LIKED BLOG */}
                        <div className="p-6 mt-10 max-w-6xl mx-auto">

                            <div className="flex justify-between items-center mb-5">
                                <h1 className="text-3xl font-bold text-white mb-8">
                                    Liked Blog
                                </h1>

                                <span className="bg-[#3b82f6]/10 text-[#60a5fa] px-3 py-1 rounded-md text-sm">
                                    Total: {allLikedBlog?.length || 0}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {blogLikedByUser?.length > 0 ? (
                                    blogLikedByUser.map((blog) => (
                                        <div key={blog._id} className="group flex flex-col justify-between border border-gray-800 bg-[#0b0f17] rounded-xl p-5 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                                            <div>
                                                <h2 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-blue-400 transition-colors">{blog.title}</h2>

                                                <p className="text-sm text-zinc-400 mt-2 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-5 text-sm text-zinc-400">
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

                                            <Link to={`/blogs/read/${blog._id}`} className="mt-5 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">Read More<GoArrowRight /></Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-10 col-span-full">
                                        No Liked Blog
                                    </p>
                                )}
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