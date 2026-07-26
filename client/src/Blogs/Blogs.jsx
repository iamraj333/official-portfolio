import React, { useEffect, useState } from "react";

import { useContext } from "react";
import { Link } from "react-router-dom";
import { ContextAPIData } from "../ContextData/ContentAPIData";
import { FaRegCaretSquareLeft, FaRegCaretSquareRight } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Loading from "../Loading";
import NoInternet from "../NoInternet";
import Swal from "sweetalert2";
import { IoEyeOutline } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { GoArrowRight, GoComment } from "react-icons/go";

export default function Blogs() {
    const { adminToken } = useContext(ContextAPIData)
    const [blogContent, setBlogContent] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isInternet, setIsInternet] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [filterCategoryBlog, setFilterCategoryBlog] = useState([])

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

    const RetriveBlogData = async () => {

        try {
            setIsLoading(true)
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/blogs`, {
                method: "GET",
            })

            const data = await response.json()
            if (data.internetError) {
                setIsInternet(false)
            }
            if (response.ok) {
                setBlogContent(data)
                setFilterCategoryBlog(data)
            }
        }
        catch (e) {
            console.error("Failed to make server connection ")
            showToast("error", "Failed to make server connection ")
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        RetriveBlogData()
    }, [])

    const lastItem = (currentPage * 6);
    const firstItem = (currentPage - 1) * 6;

    const totalPage = Math.ceil(filterCategoryBlog.length / 6)

    const goPrevPage = () => {
        if (currentPage <= 1) return;
        setCurrentPage(currentPage - 1);
    }

    const goNextPage = () => {
        if (currentPage >= totalPage) return;
        setCurrentPage(currentPage + 1);
    }

    const filterCategory = (e) => {
        const mycategory = e.target.value;
        if (mycategory == "") {
            setFilterCategoryBlog(blogContent)
        } else {
            const myfilter = blogContent.filter((blog) => blog.category === e.target.value);
            setFilterCategoryBlog(myfilter)
            // RetriveBlogData()
        }

    }

    return (
        <>
            {
                isLoading && <Loading />
            }
            <div className="min-h-screen bg-[#0b0f17] text-white font-sans flex flex-col">
                <Navbar />

                {
                    isInternet ? (<main className="flex-grow">
                        {/* HERO */}
                        <section className="relative max-w-6xl mx-auto px-4 py-20 md:py-24">

                            {/* Glow */}
                            <div className="absolute w-72 h-72 bg-[#3b82f6]/10 blur-3xl rounded-full top-10 left-0 -z-10"></div>
                            <div className="absolute w-72 h-72 bg-[#3b82f6]/10 blur-3xl rounded-full bottom-0 right-0 -z-10"></div>

                            <div className="text-center mb-16">
                                {
                                    adminToken ? (
                                        <p className="uppercase tracking-widest text-[#3b82f6] text-sm font-semibold mb-3">
                                            My Articles
                                        </p>
                                    ) : ""
                                }

                                <h1 className="text-4xl md:text-5xl font-bold mb-5">
                                    Blogs & Tutorials
                                </h1>

                                <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                    {
                                        !adminToken ? "Explore practical tutorials, coding tips, and insightful articles to enhance your development journey." : "Write about web development, React, Node.js, backend development, programming tips, and everything I learn while building real-world projects."
                                    }
                                </p>

                                {
                                    adminToken && <Link to={"/blogs/write_blog"} className="inline-block px-8 py-[10px] rounded-lg outline-none border-none bg-[#3b82f6] transition-all duration-200 hover:bg-[#02388f] font-semibold mt-4">Write Blog</Link>
                                }
                            </div>

                            {/* BLOG CARDS */}
                            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                {/* Left Side - Title */}
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">
                                        Explore Blogs
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Discover articles based on your interests
                                    </p>
                                </div>


                                {/* Filters */}
                                <div className="flex flex-wrap items-center gap-3">

                                    {/* Category */}
                                    <div className="relative">
                                        <select onChange={(e) => filterCategory(e)} className="appearance-none rounded-full border border-gray-700 bg-[#111827] px-5 py-2.5 pr-10 text-sm text-gray-200 outline-none transition hover:border-gray-500 focus:border-blue-500">
                                            <option value="">All</option>
                                            <option value="Web Development">Web Development</option>
                                            <option value="Programming">Programming</option>
                                            <option value="Tips & Tricks">Tips & Tricks</option>
                                            <option value="Tutorials">Tutorials</option>
                                            <option value="Projects">Projects</option>
                                            <option value="Case Studies">Case Studies</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Tools & Resources">Tools & Resources</option>
                                            <option value="UI/UX Design">UI/UX Design</option>
                                            <option value="Career & Learning">Career & Learning</option>
                                            <option value="Personal Story">Personal Story</option>
                                            <option value="Experience">Experience</option>
                                            <option value="Open Source">Open Source</option>
                                            <option value="Others">Others</option>
                                        </select>

                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            ↓
                                        </span>
                                    </div>


                                    {/* Preference */}
                                    {/* <div className="relative">
                                        <select onChange={(e) => alert(e.target.value)} className="appearance-none rounded-full border border-gray-700 bg-[#111827] px-5 py-2.5 pr-10 text-sm text-gray-200 outline-none transition hover:border-gray-500 focus:border-blue-500">
                                            <option>Latest</option>
                                            <option>Most Viewed</option>
                                            <option>Most Liked</option>
                                        </select>

                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            ↓
                                        </span>
                                    </div> */}


                                    {/* Search */}
                                    {/* <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="w-52 rounded-full border border-gray-700 bg-[#111827]  px-5 py-2.5 text-sm text-white placeholder:text-gray-500  outline-none transition hover:border-gray-500 focus:border-blue-500" />

                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <CiSearch />
                                        </span>
                                    </div> */}


                                </div>

                            </div>
                            <div>
                                {
                                    (filterCategoryBlog.length > 0) ? (
                                        <>
                                            {
                                                (filterCategoryBlog.length > 6) ? (
                                                    <>
                                                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                                            {[...filterCategoryBlog]
                                                                .reverse()
                                                                .slice(firstItem, lastItem)
                                                                .map((blog) => (
                                                                    <article key={blog._id} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#111827 transition-all duration-30 hover:-translate-y- hover:border-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10">
                                                                        {/* Thumbnail */}
                                                                        <div className="relative h-52 sm:h-56 overflow-hidden">
                                                                            <img src={blog.thumbnail} alt={blog.title} className="h-full w-full object-covertransition-transform duration-500group-hover:scale-110"/>

                                                                            {/* Gradient Overlay */}
                                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                                                            {/* Category */}
                                                                            <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                                                                                {blog.category}
                                                                            </span>
                                                                        </div>


                                                                        {/* Content */}
                                                                        <div className="flex flex-1 flex-col p-5">

                                                                            {/* Meta */}
                                                                            <div className="mb-4 flex items-center justify-between text-xs text-gray-400">
                                                                                <span>
                                                                                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                                                        day: "2-digit",
                                                                                        month: "short",
                                                                                        year: "numeric",
                                                                                    })}
                                                                                </span>

                                                                                <span>By <span className="text-gray-300">Author</span></span>
                                                                            </div>


                                                                            {/* Title */}
                                                                            <h2 className=" line-clamp-2 text-lg sm:text-xl font-semibold leading-snug text-white transition-colors group-hover:text-blue-400 ">
                                                                                {blog.title}
                                                                            </h2>

                                                                            {/* Excerpt */}
                                                                            <p className=" mt-3 line-clamp-3 text-sm leading-relaxed text-gray-400 ">
                                                                                {blog.excerpt}
                                                                            </p>


                                                                            {/* Stats */}
                                                                            <div className=" mt-5 flex items-center gap-5 border-t border-gray-800 pt-4 text-sm text-gray-400">
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


                                                                            {/* Footer */}
                                                                            <div className="mt-5">
                                                                                <Link to={`/blogs/read/${blog._id}`} className=" flex items-center justify-center rounded-lg bg-blue-500/10 py-2.5 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500 hover:text-white">
                                                                                    Read More →
                                                                                </Link>
                                                                            </div>

                                                                        </div>
                                                                    </article>
                                                                ))}
                                                        </div>

                                                        <div className="flex justify-center mx-auto mt-10 w-full gap-6 items-center">
                                                            <button onClick={goPrevPage} className="text-3xl block text-zinc-300 transition-all duration-300 hover:text-zinc-100"><FaRegCaretSquareLeft /></button>
                                                            <p className="text-zinc-400 font-light text-sm">{currentPage} of {totalPage}</p>
                                                            <button onClick={goNextPage} className="text-3xl block text-zinc-300 transition-all duration-300 hover:text-zinc-100"><FaRegCaretSquareRight /></button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                                                            {[...filterCategoryBlog].reverse().slice(0, lastItem).map((blog) => (
                                                                <article
                                                                    key={blog._id}
                                                                    className=" group overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] shadow-sm hover:border-gray-700"
                                                                >
                                                                    {/* Thumbnail */}
                                                                    <div className="relative overflow-hidden">
                                                                        <div className="w-full z-10 bg-black/100">
                                                                            <img
                                                                                src={blog.thumbnail}
                                                                                alt={blog.title}
                                                                                className="h-56 w-full object-cover transition-all duration-[0.4s] group-hover:scale-[120%]"
                                                                            />
                                                                        </div>

                                                                        {/* Category Overlay */}
                                                                        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                                                                            {blog.category}
                                                                        </span>
                                                                    </div>

                                                                    {/* Content */}
                                                                    <div className="flex flex-col px-6 py-4">

                                                                        {/* Date */}
                                                                        <div className="mb-2 flex items-center justify-between text-sm">
                                                                            <p className="text-gray-500">
                                                                                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                                                    day: "2-digit",
                                                                                    month: "short",
                                                                                    year: "numeric",
                                                                                })}
                                                                            </p>

                                                                            <p className="text-gray-400">
                                                                                By <span className="text-gray-300 font-medium">Author</span>
                                                                            </p>
                                                                        </div>

                                                                        {/* Title */}
                                                                        <h2 className="mb-3 text-xl font-semibold leading-snug text-white">
                                                                            {blog.title}
                                                                        </h2>


                                                                        {/* Excerpt */}
                                                                        <p className="mb-6 line-clamp-3 leading-relaxed text-gray-400">
                                                                            {blog.excerpt}
                                                                        </p>

                                                                        {/* Footer */}
                                                                        <div className="mt-auto flex items-center justify-between border-t border-gray-800 pt-5">
                                                                            <Link to={`/blogs/read/${blog._id}`} className="text-sm font-medium text-[#3b82f6] hover:text-white">
                                                                                Read More →
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </article>
                                                            ))}
                                                        </div>

                                                        <div className="flex justify-center mx-auto mt-10 w-full gap-6 items-center">
                                                            <button onClick={goPrevPage} className="text-3xl block text-zinc-300 transition-all duration-300 hover:text-zinc-100"><FaRegCaretSquareLeft /></button>
                                                            <p className="text-zinc-400 font-light text-sm">1 of 1</p>
                                                            <button onClick={goNextPage} className="text-3xl block text-zinc-300 transition-all duration-300 hover:text-zinc-100"><FaRegCaretSquareRight /></button>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </>
                                    ) : (
                                        <div className="w-full rounded-lg border border-dashed border-gray-800 bg-gray-950/40 p-8 text-center text-gray-400 transition-all duration-300 hover:border-[#3b82f6]/50">
                                            <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-[#3b82f6]">
                                                Blog Coming Soon
                                            </span>
                                            <p className="text-sm text-gray-500">
                                                No posts available yet. Stay tuned for upcoming content.
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                        </section>
                    </main>) : (<NoInternet />)
                }

                <Footer />
            </div>
        </>
    );
}