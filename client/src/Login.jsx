import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Swal from "sweetalert2";
import { useContext } from "react";
import { ContextAPIData } from "./ContextData/ContentAPIData";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function Login() {
    const { currentUser, adminToken } = useContext(ContextAPIData)
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const [isLoading, setIsLoading] = useState(false)

    const loginInputChangeHandler = (e) => {
        const { name, value, type, checked } = e.target;

        setLoginData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

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

    //handling upcoming state from Navigate tag
    const { state } = useLocation()
    useEffect(() => {
        if (state) {
            showToast('warning', state.warning)
        }
    }, [state])

    const { storeTokenInLocalStorage } = useContext(ContextAPIData)
    const navigate = useNavigate()

    const LoginFormHandler = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            })

            const data = await response.json()
            if (data.success) {
                showToast('success', `${data.success}`)
                setLoginData({
                    email: "",
                    password: "",
                    rememberMe: false
                })

                //token storing in local storage 
                storeTokenInLocalStorage(data.token)
                navigate("/")
            }
            else {
                showToast('error', `${data.error}`)
            }
        }
        catch (e) {
            console.error("Failed to login")
            showToast("Failed to connect server")
        }
        finally {
            setIsLoading(false)
        }
    }

    if (currentUser || adminToken) {
        showToast("warning", "You're already logged in")
        return <Navigate to={'/'} />
    }

    return (
        <>
            <Navbar />
            {
                isLoading && <Loading />
            }
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f17] px-4 py-12">

                {/* OUTSIDE HEADING SECTION */}
                <div className="text-center max-w-2xl mb-10">

                    <h1 className="text-4xl font-bold text-white mb-3">
                        Welcome Back
                    </h1>

                    <p className="text-[#9ca3af] text-sm leading-relaxed">
                        Login to continue building and managing your developer projects with Dev.Craft.
                    </p>

                </div>

                {/* MAIN CARD */}
                <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-2xl border border-gray-800 shadow-2xl">

                    {/* LEFT SIDE */}
                    <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-[#0f172a] to-[#0b0f17] relative">

                        <div className="absolute w-72 h-72 bg-[#3b82f6]/20 blur-3xl rounded-full top-10 left-10"></div>

                        <h1 className="text-4xl text-zinc-100 font-bold mb-4 relative">
                            Welcome to <span className="text-[#3b82f6]">Dev.Craft</span>
                        </h1>

                        <p className="text-[#9ca3af] mb-8 leading-relaxed relative">
                            Continue your journey of building modern web applications with clean architecture and scalable systems.
                        </p>

                        <div className="space-y-4 text-sm text-[#9ca3af] relative">

                            <div className="flex gap-3 items-center">
                                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                                Access your saved projects anytime
                            </div>

                            <div className="flex gap-3 items-center">
                                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                                Secure and fast authentication
                            </div>

                            <div className="flex gap-3 items-center">
                                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                                Manage your developer workspace
                            </div>

                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="p-10 bg-[#111827]">

                        <h2 className="text-3xl font-bold text-white mb-2">
                            Login
                        </h2>

                        <p className="text-[#9ca3af] text-sm mb-8">
                            Enter your credentials to continue
                        </p>

                        <form onSubmit={LoginFormHandler} className="space-y-5">

                            <input
                                type="email"
                                name="email"
                                onChange={loginInputChangeHandler}
                                value={loginData.email}
                                placeholder="Email Address"
                                className="w-full px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-800 text-white focus:border-[#3b82f6] outline-none"
                            />

                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={loginInputChangeHandler}
                                placeholder="Password"
                                className="w-full px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-800 text-white focus:border-[#3b82f6] outline-none"
                            />

                            <div className="flex justify-between items-center text-xs text-[#9ca3af]">

                                <label className="flex items-center gap-2">
                                    <input checked={loginData.rememberMe} name="rememberMe" onChange={loginInputChangeHandler} type="checkbox" className="accent-[#3b82f6]" />
                                    Remember me
                                </label>

                                <a className="text-[#3b82f6] hover:underline cursor-pointer">
                                    Forgot password?
                                </a>

                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] transition font-medium text-white"
                            >
                                Login
                            </button>

                            <p className="text-xs text-center text-[#9ca3af]">
                                Don’t have an account?{" "}
                                <a href="/register" className="text-[#3b82f6] hover:underline cursor-pointer">
                                    Register
                                </a>
                            </p>

                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}