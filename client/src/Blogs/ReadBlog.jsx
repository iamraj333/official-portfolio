import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BiSolidCommentDetail } from "react-icons/bi";
import { IoMdMore } from "react-icons/io";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { useState } from "react";
import { useEffect } from "react";
import './ReadBlog.css'
import { Link } from "react-router-dom";
import Loading from "../Loading";
import NoInternet from "../NoInternet";
import { HashLink } from "react-router-hash-link";
import Swal from "sweetalert2";
import { useContext } from "react";
import { ContextAPIData } from "../ContextData/ContentAPIData";

export default function ReadBlog() {

    const { id } = useParams();
    const { userToken, currentUser } = useContext(ContextAPIData)
    const [blogContent, setBlogContent] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isInternet, setIsInternet] = useState(true)
    const [isLike, setIsLike] = useState(false)
    const [isDislike, setIsDislike] = useState(false)
    const [userComment, setUserComment] = useState("")

    //Swal Toast
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

    const FetchBlogContentFunction = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/blogs/read/${id}`, {
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
            showToast("error", "Failed to connect server")
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        FetchBlogContentFunction()
    }, [])

    //user Actions
    const LikeBtn = async (e, blogId) => {
        e.preventDefault();
        setIsDislike(false)
        setIsLike(!isLike)

        if (!userToken) {
            showToast("error", "loggin is required to action")
            return;
        } else {
            try {
                const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/blogs/like/${blogId}`, {
                    method: 'POST',
                    headers: {
                        token: userToken
                    }
                })

                const data = await response.json();

                if (data.internetError) {
                    showToast("error", data.internetError)
                    setIsLike(false)
                    setIsDislike(false)
                }
                else {
                    if (data.userTokenExpireError) {
                        localStorage.removeItem('MyToken')
                        setIsLike(false)
                        setIsDislike(false)
                    }
                    else {
                        if (data.success) {
                            setIsLike(true)
                            FetchBlogContentFunction()
                            setIsDislike(false)
                        }
                        else {
                            showToast("error", data.error)
                            setIsLike(false)
                            setIsDislike(false)
                        }
                    }
                }
            }
            catch (e) {
                console.error("Failed to connect server")
                setIsLike(false)
                setIsDislike(false)
            }
        }
    }

    const DislikeBtn = async (e, blogId) => {
        setIsLike(false)
        setIsDislike(!isDislike)

        if (!userToken) {
            showToast("error", "loggin is required to action")
            return;
        } else {
            try {
                const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/blogs/dislike/${blogId}`, {
                    method: 'POST',
                    headers: {
                        token: userToken
                    }
                })

                const data = await response.json();

                if (data.internetError) {
                    showToast("error", data.internetError)
                    setIsLike(false)
                    setIsDislike(false)
                }
                else {
                    if (data.userTokenExpireError) {
                        localStorage.removeItem('MyToken')
                        setIsLike(false)
                        setIsDislike(false)
                    }
                    else {
                        if (data.success) {
                            setIsDislike(true)
                            FetchBlogContentFunction()
                            setIsLike(false)
                        }
                        else {
                            showToast("error", data.error)
                            setIsLike(false)
                            setIsDislike(false)
                        }
                    }
                }
            }
            catch (e) {
                console.error("Failed to connect server")
                setIsLike(false)
                setIsDislike(false)
            }
        }
    }


    //USER COMMENT
    const submitComment = async (e, blogId) => {
        e.preventDefault()
        setIsLoading(true)
        if (!userToken) {
            showToast("error", "loggin is required to comment")
            return;
        }
        else {
            if (!userComment) {
                showToast("error", "comment text required")
                setIsLoading(false)
                return;
            }
            if (userComment.split("").length < 3) {
                showToast("error", "Comment is too short")
                setIsLoading(false)
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/blogs/read/${blogId}/comment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: userToken
                    },
                    body: JSON.stringify({ content: userComment })
                })

                const data = await response.json();

                if (data.internetError) {
                    // setIsInternet(false)
                    showToast("error", data.internetError)
                }
                else {
                    if (data.userTokenExpireError) {
                        localStorage.removeItem('MyToken')
                        showToast("error", data.userTokenExpireError)
                    }
                    else {
                        if (data.success) {
                            showToast("success", data.success)
                            FetchBlogContentFunction()
                            setUserComment("");
                        }
                        else {
                            showToast("error", data.error)
                        }
                    }
                }
            }
            catch (e) {
                console.error("Failed to connect server")
            }
            finally {
                setIsLoading(false)
            }
        }
    }


    const navigate = useNavigate();

    return (
        <>
            {
                isLoading && <Loading />
            }
            <div className="min-h-screen bg-[#0b0f17] text-white font-sans">

                <Navbar />


                {
                    isInternet ? (
                        <main className="relative">

                            {/* BACKGROUND GLOW */}
                            <div className="absolute top-20 left-20 w-72 h-72 bg-[#3b82f6]/10 blur-3xl rounded-full -z-10" />



                            <article className="max-w-4xl mx-auto px-4 py-20 md:py-28">
                                <button onClick={() => navigate(-1)} className=" group mb-6 flex items-center gap-2 text-lg text-gray-300 hover:text-white transition duration-300">
                                    <span className="text-xl">←</span> <span className="group-hover:underline">Back</span>
                                </button>

                                {/* ARTICLE HEADER */}
                                <header>


                                    <Link to={`/blogs/filter/category=${blogContent.category}`} className=" cursor-pointer text-sm font-semibold uppercase tracking-wider text-[#3b82f6] mb-5 hover:underline">
                                        {blogContent.category}
                                    </Link>


                                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                                        {blogContent.title}
                                    </h1>


                                    <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mb-8">
                                        {blogContent.excerpt}
                                    </p>



                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        {/* Left Section */}
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                            <span>
                                                {new Date(blogContent.createdAt).toLocaleDateString("en-US", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>

                                            <span className="hidden sm:inline text-gray-700">•</span>

                                            <span>By Author</span>
                                        </div>

                                        {/* Right Section */}
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            {/* Like */}
                                            <button
                                                onClick={(e) => LikeBtn(e, blogContent._id)}
                                                className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-200
                ${isLike || blogContent?.likes?.length > 0
                                                        ? "bg-blue-500/20 text-blue-400"
                                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                                    }`}
                                            >
                                                <HiThumbUp className="text-lg sm:text-xl" />
                                                <span className="text-sm font-medium">
                                                    {blogContent?.likes?.length || 0}
                                                </span>
                                            </button>

                                            {/* Dislike */}
                                            <button
                                                onClick={(e) => DislikeBtn(e, blogContent._id)}
                                                className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-200
                ${isDislike || blogContent?.dislikes?.length > 0
                                                        ? "bg-red-500/20 text-red-400"
                                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                                    }`}
                                            >
                                                <HiThumbDown className="text-lg sm:text-xl" />
                                                <span className="text-sm font-medium">
                                                    {blogContent?.dislikes?.length || 0}
                                                </span>
                                            </button>

                                            {/* Comments */}
                                            <HashLink
                                                smooth
                                                to={`/blogs/read/${blogContent._id}/#userComments`}
                                                className="rounded-full bg-zinc-800 p-2 text-zinc-300 transition-all duration-200 hover:bg-zinc-700 hover:text-white"
                                            >
                                                <BiSolidCommentDetail className="text-lg sm:text-xl" />
                                            </HashLink>

                                            {/* More */}
                                            <button className="rounded-full bg-zinc-800 p-2 text-zinc-300 transition-all duration-200 hover:bg-zinc-700 hover:text-white">
                                                <IoMdMore className="text-lg sm:text-xl" />
                                            </button>
                                        </div>
                                    </div>


                                </header>

                                {/* ARTICLE CONTENT */}
                                <div className="prose prose-invert max-w-none">


                                    <div className="text-gray-300 text-lg leading-9 whitespace-pre-line">

                                        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blogContent.content }} />

                                    </div>


                                </div>


                                {/* TAGS */}
                                <div className="mt-16 pt-8 border-t border-gray-800">


                                    <p className="text-sm text-gray-500 mb-4">
                                        Tags
                                    </p>


                                    <div className="flex flex-wrap gap-3">

                                        {blogContent?.tags?.[0]?.split(",").map((tag) => (

                                            <Link key={tag} to={`/blogs/filter/tags/${encodeURIComponent(tag.trim())}`} className="px-3 py-1 rounded-md bg-[#111827] border border-gray-800 text-sm text-gray-400 transition-all duration-75 hover:bg-blue-400/30">
                                                #{tag}
                                            </Link>

                                        ))}

                                    </div>


                                </div>


                                {/* User Comments */}
                                <div id="userComments" className="mt-16 border-t border-gray-800 pt-10">

                                    <div className="mb-8 flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-white">Comments</h3>
                                        <span className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-400">{blogContent?.comments?.length} Comments</span>
                                    </div>


                                    {/* Comment Input */}
                                    <div className="mb-10">
                                        <textarea required rows={4} value={userComment} onChange={(e) => setUserComment(e.target.value)} placeholder="Share your thoughts..." className="w-full resize-none rounded-xl border border-gray-700 bg-[#0f172a] p-4 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-blue-500" />

                                        <div className="mt-3 flex justify-end">
                                            <button onClick={(e) => submitComment(e, blogContent._id)} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700">Post Comment</button>
                                        </div>
                                    </div>


                                    {/* All Comment */}
                                    <div className="flex flex-col gap-4">
                                        {
                                            blogContent?.comments?.length > 0 ? (
                                                [...blogContent.comments].reverse().map((comment) => (
                                                    <div key={comment?._id} className="border-b border-gray-800 py-5">

                                                        <div className="flex items-center gap-3">

                                                            <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white`}>{comment?.user?.name.split('')[0]}</div>

                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-semibold text-white">
                                                                        {
                                                                            (comment?.user?.name === currentUser.name) ? "You" : comment?.user?.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">• {new Date(comment?.createdAt).toLocaleDateString('en-IN', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}</span>
                                                                </div>
                                                            </div>

                                                        </div>


                                                        <p className="mt-3 text-sm leading-relaxed text-gray-300">{comment?.content}</p>

                                                        <div className="mt-3 flex items-center gap-5 text-xs text-gray-500">
                                                            <button className="flex items-center gap-1 transition hover:text-blue-400">Like</button>
                                                            <button className="transition hover:text-blue-400">Reply</button>
                                                        </div>

                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-zinc-400/40 font-medium">No Comment</div>
                                            )
                                        }
                                    </div>

                                </div>

                            </article>


                        </main>
                    ) : (<NoInternet />)
                }




                <Footer />

            </div>
        </>
    );
}