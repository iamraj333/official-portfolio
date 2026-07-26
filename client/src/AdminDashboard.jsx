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
                isLoading && <Loading />
            }
            <Navbar />

            <div className="min-h-screen bg-[#0a0f1f] text-white">
                {/* HERO */}
                <section className="relative overflow-hidden pb-8 sm:pb-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-cyan-500/20 blur-3xl"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
                        <div className="rounded-2xl lg:rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 lg:p-8 backdrop-blur-md">

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                <div className="flex-1">
                                    <span className="text-sm font-medium text-cyan-400">
                                        ADMIN PANEL
                                    </span>

                                    <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                                        Welcome,{" "}
                                        <span className="text-cyan-400">
                                            Admin
                                        </span>
                                    </h1>

                                    <p className="mt-4 max-w-2xl text-sm text-gray-400 sm:text-base">
                                        Monitor platform activity, manage users, track
                                        sales, and oversee system operations from one
                                        centralized dashboard.
                                    </p>
                                </div>

                                <div className="flex justify-start lg:justify-end">
                                    {isInternet ? (
                                        <div className="rounded-full border border-green-500/30 bg-green-500/15 px-4 py-2">
                                            <span className="whitespace-nowrap text-sm text-green-400">
                                                ● System Operational
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="rounded-full border border-red-500/30 bg-red-500/15 px-4 py-2">
                                            <span className="whitespace-nowrap text-sm text-red-400">
                                                ❗ Network Connectivity Issue
                                            </span>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* ANALYTICS */}
                <section className="relative -mt-4 sm:-mt-6 lg:-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-10">

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {/* USERS */}
                        <div className="rounded-2xl border border-blue-500/20 bg-[#101827] p-5 sm:p-6 transition hover:border-blue-500/50">
                            <div className="text-sm text-blue-400">
                                Total Users
                            </div>

                            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                {allUsers.length}
                            </h2>

                            <p className="mt-2 text-sm text-green-400">
                                +12% this month
                            </p>
                        </div>

                        {/* BLOGS */}
                        <div className="rounded-2xl border border-purple-500/20 bg-[#101827] p-5 sm:p-6 transition hover:border-purple-500/50">
                            <div className="text-sm text-purple-400">
                                Total Blogs
                            </div>

                            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                {blogContent.length || 0}
                            </h2>

                            <p className="mt-2 text-sm text-green-400">
                                Published blogs
                            </p>
                        </div>

                        {/* MESSAGES */}
                        <div className="rounded-2xl border border-orange-500/20 bg-[#101827] p-5 sm:p-6 transition hover:border-orange-500/50">
                            <div className="text-sm text-orange-400">
                                Total Messages
                            </div>

                            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                {allMessages.length + allNormalMessages.length}
                            </h2>

                            <p className="mt-2 text-sm text-yellow-400">
                                Needs Attention
                            </p>
                        </div>

                        {/* REVENUE */}
                        <div className="rounded-2xl border border-cyan-500/20 bg-[#101827] p-5 sm:p-6 transition hover:border-cyan-500/50">
                            <div className="text-sm text-cyan-400">
                                Revenue
                            </div>

                            <h2 className="mt-3 break-words text-2xl font-bold sm:text-3xl">
                                Not Disclosed (₹)
                            </h2>

                            <p className="mt-2 text-sm text-green-400">
                                0% growth
                            </p>
                        </div>

                    </div>
                </section>

                {/* MAIN CONTENT */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 lg:pb-12">

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">

                        {/* QUICK ACTIONS */}
                        <div className="h-fit w-full rounded-2xl lg:rounded-3xl border border-gray-800 bg-[#101827] p-5 sm:p-6 lg:sticky lg:top-20">

                            <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
                                Quick Actions
                            </h2>

                            <div className="space-y-4">

                                <button className="w-full rounded-xl bg-blue-600 text-left transition hover:scale-[1.02] hover:bg-blue-700 active:scale-95">
                                    <HashLink
                                        smooth
                                        to="/admin/users"
                                        className="block px-4 py-3 sm:py-4"
                                    >
                                        Manage Users
                                    </HashLink>
                                </button>

                                <button className="w-full rounded-xl bg-purple-600 text-left transition hover:scale-[1.02] hover:bg-purple-700 active:scale-95">
                                    <HashLink
                                        smooth
                                        to="/admin/messages"
                                        className="block px-4 py-3 sm:py-4"
                                    >
                                        User Messages
                                    </HashLink>
                                </button>

                                <button className="w-full rounded-xl bg-cyan-600 text-left transition hover:scale-[1.02] hover:bg-cyan-700 active:scale-95">
                                    <HashLink
                                        smooth
                                        to="/admin/blogs"
                                        className="block px-4 py-3 sm:py-4"
                                    >
                                        Blogs
                                    </HashLink>
                                </button>

                                <button className="w-full rounded-xl bg-orange-600 text-left transition hover:scale-[1.02] hover:bg-orange-700 active:scale-95">
                                    <HashLink
                                        smooth
                                        to="/"
                                        className="block px-4 py-3 sm:py-4"
                                    >
                                        Home
                                    </HashLink>
                                </button>

                            </div>
                        </div>

                        {/* OUTLET */}
                        <div className="min-w-0 w-full lg:col-span-2">
                            <Outlet />
                        </div>

                    </div>

                </section>
            </div>

            <Footer />
        </>
    );
}