import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ContextAPIData } from "./ContextData/ContentAPIData";
import { Link, Navigate, Outlet } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import Loading from "./Loading"

export default function AdminDashboard() {
    const { userToken, adminToken, blogContent } = useContext(ContextAPIData);
    const [allUsers, setAllUsers] = useState("")
    const [allMessages, setAllMessages] = useState("")
    const [allNormalMessages, setAllNormalMessages] = useState("")
    const { currentUser, isLoading } = useContext(ContextAPIData)
    const [isInternet, setIsInternet] = useState(true)

    const getAllUser = async () => {
        const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin`, {
            method: "GET",
            headers: {
                token: adminToken
            }
        })

        const data = await response.json()
        if (data.adminTokenExpire) {
            localStorage.removeItem('AdminToken')
        }
        if (data.internetError) {
            setIsInternet(false)
        }
        else {
            setAllUsers(data.allUserData);
            setAllMessages(data.allMessages);
            setAllNormalMessages(data.allNormalMessages)
        }
    }

    useEffect(() => {
        getAllUser();

    }, [])

    if (!adminToken) {
        return <Navigate to="/admin/login" state={{ warning: "Login to access admin panel" }}></Navigate>
    }



    return (
        <>
        {
            isLoading && <Loading/>
        }
            <Navbar />

            <div className="min-h-screen bg-[#0a0f1f] text-white">

                {/* HERO */}
                <section className="relative overflow-hidden pb-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-cyan-500/20 blur-3xl"></div>

                    <div className="relative max-w-7xl mx-auto px-6 py-12">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">

                            <div className="flex flex-col lg:flex-row justify-between gap-8">

                                <div>
                                    <span className="text-cyan-400 text-sm font-medium">
                                        ADMIN PANEL
                                    </span>

                                    <h1 className="text-4xl md:text-5xl font-bold mt-3">
                                        Welcome,
                                        <span className="text-cyan-400">
                                            Admin
                                            {/* {" "}
                                            {currentUser?.currentUser?.name || "Admin"} */}
                                        </span>
                                    </h1>

                                    <p className="text-gray-400 mt-4 max-w-2xl">
                                        Monitor platform activity, manage users,
                                        track sales, and oversee system operations
                                        from one centralized dashboard.
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    {
                                        isInternet ? (
                                            <div className="bg-green-500/15 border border-green-500/30 px-4 py-2 rounded-full">
                                                <span className="text-green-400 text-sm">
                                                    ● System Operational
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="bg-red-500/15 border border-red-500/30 px-4 py-2 rounded-full">
                                                <span className="text-red-400 text-sm">
                                                     ❗Network Connectivity Issue
                                                </span>
                                            </div>
                                        )
                                    }
                                </div>

                            </div>

                        </div>
                    </div>
                </section>

                {/* ANALYTICS */}
                <section className="relative -top-10 max-w-7xl mx-auto px-6 pb-10">

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                        <div className="bg-[#101827] border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/50 transition">
                            <div className="text-blue-400 text-sm">
                                Total Users
                            </div>
                            <h2 className="text-4xl font-bold mt-3">{allUsers.length}</h2>
                            <p className="text-green-400 text-sm mt-2">
                                +12% this month
                            </p>
                        </div>

                        <div className="bg-[#101827] border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/50 transition">
                            <div className="text-purple-400 text-sm">
                                Total Blogs
                            </div>
                            <h2 className="text-4xl font-bold mt-3">{blogContent.length || 0}</h2>
                            <p className="text-green-400 text-sm mt-2">
                                Published blog
                            </p>
                        </div>

                        <div className="bg-[#101827] border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition">
                            <div className="text-orange-400 text-sm">
                                Total Messages
                            </div>
                            <h2 className="text-4xl font-bold mt-3">{(allMessages.length + (allNormalMessages.length))}</h2>
                            <p className="text-yellow-400 text-sm mt-2">
                                Needs Attention
                            </p>
                        </div>

                        <div className="bg-[#101827] border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/50 transition">
                            <div className="text-cyan-400 text-sm">
                                Revenue
                            </div>
                            <h2 className="text-3xl font-bold mt-3">
                                Not Disclosed(₹)
                            </h2>
                            <p className="text-green-400 text-sm mt-2">
                                0% growth
                            </p>
                        </div>

                    </div>

                </section>

                {/* MAIN CONTENT */}
                <section className="max-w-7xl mx-auto px-6 pb-12">
                    <div className="grid lg:grid-cols-3 lg:grid-cols gap-8">
                        {/* QUICK ACTIONS */}
                        <div className="w-full h-fit bg-[#101827] border border-gray-800  rounded-3xl p-4 lg:sticky lg:top-[80px]">

                            <h2 className="text-2xl font-semibold mb-6">
                                Quick Actions
                            </h2>

                            <div className="space-y-4">

                                <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl text-left transition">
                                    <HashLink className="p-4 block" smooth to={"/admin/users"}>Manage Users</HashLink>
                                </button>

                                <button className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl text-left transition">
                                    <HashLink className="p-4 block" smooth to={"/admin/messages"}>User Messages</HashLink>
                                </button>

                                <button className="w-full bg-cyan-600 hover:bg-cyan-700 rounded-xl text-left transition">
                                    <HashLink className="p-4 block" smooth to={"/admin/blogs"}>Blogs</HashLink>
                                </button>

                                <button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl  text-left transition">
                                    <HashLink className="p-4 block" smooth to={"/"}>Home</HashLink>
                                </button>
                            </div>


                        </div>

                        <div className="w-full lg:col-span-2">
                            <Outlet />
                        </div>

                    </div>

                </section>



            </div>

            <Footer />
        </>
    );
}