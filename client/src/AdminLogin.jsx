import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useContext } from "react";
import { ContextAPIData } from "./ContextData/ContentAPIData";
import { useEffect } from "react";

export default function AdminLogin() {
    const {storeAdminTokenInLocalStorage}=useContext(ContextAPIData)
    const [isLoading, setIsLoading] = useState(false);
    const [adminData, setAdminData] = useState({
        email: "",
        password: ""
    })

    const InputHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setAdminData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const navigate = useNavigate()

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

    const {state}=useLocation()
    useEffect(()=>{
        if(state){
        showToast("warning", state.warning)
    }
    }, [state])

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(adminData)
            });

            const data = await response.json()
            if (data.success) {
                showToast("success", data.success)

                //storing admintoken in localstorage
                storeAdminTokenInLocalStorage(data.adminToken)
                navigate("/admin")
            }
            else {
                showToast("error", data.error)
            }
        }
        catch (e) {
            console.error("Login Server failed")
            showToast("Login Server Failed")
        }
        finally{
                setIsLoading(false)
        }
    };

    return (
        <>
            {
                isLoading && <Loading/>
            }

            <div className="min-h-screen bg-[#0b0f17] text-white font-sans flex flex-col">
                <Navbar />

                <main className="flex-grow flex items-center justify-center px-4 relative">

                    {/* BACKGROUND GLOW */}
                    <div className="absolute w-72 h-72 bg-[#3b82f6]/10 blur-3xl rounded-full top-10 left-10 -z-10"></div>
                    <div className="absolute w-72 h-72 bg-[#3b82f6]/10 blur-3xl rounded-full bottom-10 right-10 -z-10"></div>

                    {/* LOGIN CARD */}
                    <div className="w-full max-w-md bg-[#111827]/80 border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">

                        {/* TITLE */}
                        <h1 className="text-3xl font-bold text-center mb-2">
                            Admin Login
                        </h1>

                        <p className="text-gray-400 text-center mb-8 text-sm">
                            Only authorized admins can access dashboard
                        </p>

                        {/* FORM */}
                        <form onSubmit={handleLogin} className="space-y-5">

                            {/* EMAIL */}
                            <div>
                                <label className="text-sm text-gray-400">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={adminData.email}
                                    onChange={InputHandler}
                                    placeholder="admin@example.com"
                                    className="w-full mt-2 px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-700 focus:border-[#3b82f6] outline-none text-white"
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="text-sm text-gray-400">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={adminData.password}
                                    onChange={InputHandler}
                                    placeholder="••••••••"
                                    className="w-full mt-2 px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-700 focus:border-[#3b82f6] outline-none text-white"
                                />
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] transition-colors font-medium shadow-lg shadow-[#3b82f6]/20"
                            >
                                Login
                            </button>
                        </form>

                        {/* FOOT NOTE */}
                        <p className="text-xs text-gray-500 text-center mt-6">
                            Protected Admin Access
                        </p>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}   