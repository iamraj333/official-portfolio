import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loading from "./Loading";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { useContext } from "react";
import { ContextAPIData } from "./ContextData/ContentAPIData";

export default function Register() {
    const { currentUser, adminToken } = useContext(ContextAPIData)
    const [isLoading, setIsLoading] = useState(false)
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [isotpSending, setOtpSending] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const [verifyingOtp, setVerifyingOtp] = useState(false)
    const [isOtpSent, setOtpSent] = useState(false)
    const [userInputOtp, setUserInputOtp] = useState("")

    const InputChangeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setRegisterData({
            ...registerData,
            [name]: value
        })
    }

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

    const navigate = useNavigate();

    const sendotpHandler = async (e) => {
        setOtpSending(true)
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/auth/email`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: registerData.email })
            })

            const data = await response.json();
            if (data.success) {
                showToast("success", data.success)
                setOtpSent(true)
            }
            else if(data.details){
                console.log(data.details)
            }
            else {
                showToast("error", data.error)
            }
        }
        catch (e) {
            showToast("error", "Failed to send email")
        }
        finally {
            setOtpSending(false)
        }
    }

    const VerifyOTPHandler = async (e) => {
        e.preventDefault();
        setVerifyingOtp(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/auth/email/verify`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userOtp: userInputOtp, email: registerData.email })
            })

            const data=await response.json();
            if(data.success){
                showToast("success", data.success);
                setIsEmailVerified(true);
            }
            else{
                showToast("error", data.error)
            }
        }
        catch (e) {
            console.error("Failed to verify OTP with backend: ", e)
        }
        finally {
            setVerifyingOtp(false)
        }
    }

    const RegisterSubmitHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (!isEmailVerified) {
            showToast("error", "you have to verified email before create account")
            setIsLoading(false)
            return;
        }
        else {
            try {
                const response = await fetch(`${import.meta.env.VITE_CLIENT_URL}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(registerData)
                })


                const data = await response.json()
                if (data.internetError) {
                    showToast("error", data.internetError)
                }
                else {
                    if (data.success) {
                        showToast('success', `${data.success}`)
                        setRegisterData({
                            name: "",
                            email: "",
                            password: "",
                            confirmPassword: ""
                        })

                        navigate("/login")
                    }
                    else {
                        showToast('error', `${data.error}`)
                    }
                }
            }
            catch (e) {
                console.error("Failed to send Data to the server")
                showToast("error", "Failed to send data to the server")
            }
            finally {
                setIsLoading(false)
            }
        }

    }

    if (currentUser || adminToken) {
        showToast("warning", "You're already logged in")
        return <Navigate to={'/'} />
    }

    return (
        <>
            {
                isLoading && <Loading />
            }
            <Navbar />

            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f17] px-4 py-6">

                {/* OUTSIDE HEADING SECTION */}
                <div className="text-center max-w-2xl mb-4">

                    <h1 className="text-4xl font-bold text-white mb-3">
                        Create Your Account
                    </h1>

                    <p className="text-[#9ca3af] text-sm leading-relaxed">
                        Join Raj.Craft and start building modern developer projects with a clean workflow, secure authentication, and powerful tools.
                    </p>

                </div>

                {/* MAIN CARD */}
                <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-2xl border border-gray-800 shadow-2xl">

                    {/* LEFT SIDE */}
                    <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-[#0f172a] to-[#0b0f17] relative">

                        <div className="absolute w-72 h-72 bg-[#3b82f6]/20 blur-3xl rounded-full top-10 left-10"></div>

                        <h1 className="text-4xl text-zinc-100 font-bold mb-4 relative">
                            Build with <span className="text-[#3b82f6]">Raj.Craft</span>
                        </h1>

                        <p className="text-[#9ca3af] mb-8 leading-relaxed relative">
                            A modern developer platform to build, track and deploy your projects with speed and clarity.
                        </p>

                        <div className="space-y-4 text-sm text-[#9ca3af] relative">

                            <div className="flex gap-3 items-center">
                                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                                Lightning fast developer workflow
                            </div>

                            <div className="flex gap-3 items-center">
                                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                                Secure authentication system
                            </div>

                            <div className="flex gap-3 items-center">
                                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                                Modern project dashboard
                            </div>

                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="p-10 bg-[#111827]">

                        <h2 className="text-3xl font-bold text-white mb-2">
                            Create Account
                        </h2>

                        <p className="text-[#9ca3af] text-sm mb-8">
                            Join and start building your developer portfolio
                        </p>

                        <form onSubmit={RegisterSubmitHandler} className="space-y-5">

                            <input
                                type="text"
                                name="name"
                                onChange={InputChangeHandler}
                                value={registerData.name}
                                placeholder="Full Name"
                                className="w-full px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-800 text-white focus:border-[#3b82f6] outline-none"
                            />


                            {/* =========================
                                        EMAIL
                                    ========================= */}
                            <div>
                                <div className="flex flex-col gap-2 sm:flex-row">

                                    <input
                                        type="email"
                                        name="email"
                                        onChange={InputChangeHandler}
                                        value={registerData.email}
                                        placeholder="Email Address"
                                        className="w-full px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-800 text-white focus:border-[#3b82f6] outline-none"
                                    />

                                    <button
                                        type="button"
                                        disabled={isEmailVerified || isotpSending}
                                        onClick={sendotpHandler}
                                        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:whitespace-nowrap">
                                        {
                                            !isotpSending ? "Send OTP" : (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-4 h-4 rounded-full border border-red-100 border-t-blue-500 animate-spin"></span> Sending...
                                                    </div>
                                                </>
                                            )
                                        }
                                    </button>

                                </div>

                            </div>

                            {/* =========================
                                        OTP VERIFICATION
                                    ========================= */}
                            {
                                isOtpSent && (
                                    <div className="">

                                        <div className="mb-2 flex items-center justify-between">

                                            <label
                                                htmlFor="otp"
                                                className="text-sm font-medium text-gray-300"
                                            >
                                                Email Verification
                                            </label>

                                            {isEmailVerified && (
                                                <span className="text-xs font-medium text-green-400">
                                                    ✓ Verified
                                                </span>
                                            )}

                                        </div>

                                        <div
                                            className={`rounded-xl border p-4 sm:p-5 border-gray-800 bg-[#0d131d]`}>

                                            {/* DESCRIPTION */}
                                            <p className="mb-4 text-xs leading-5 text-gray-500">
                                                Enter your email above and click Send OTP to receive a verification code."
                                            </p>

                                            {/* SINGLE OTP INPUT */}
                                            <input id="otp" type="text" inputMode="numeric" maxLength={6}
                                                placeholder="000000"
                                                value={userInputOtp}
                                                disabled={isEmailVerified || verifyingOtp}
                                                onChange={(e) => setUserInputOtp(e.target.value)}
                                                autoComplete="one-time-code"
                                                className={`w-full rounded-lg border bg-[#080c13] px-4 py-3 text-center text-xl font-semibold tracking-[0.5em] outline-none transition  border-gray-800 text-gray-300 placeholder:text-gray-800`} />

                                            {/* VERIFY BUTTON */}
                                            {!isEmailVerified && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        VerifyOTPHandler
                                                    }
                                                    className="mt-4 w-full rounded-lg bg-gray-800 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    {verifyingOtp
                                                        ? "Verifying..."
                                                        : "Verify Email"}
                                                </button>
                                            )}

                                            {/* RESEND */}
                                            {/* {!isEmailVerified && (
                                                <div className="mt-3 flex flex-col items-center justify-between gap-2 sm:flex-row">
                                                    
                                                    <p className="text-xs text-gray-600">
                                                        Didn't receive
                                                        the code?
                                                    </p>
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            SendOTPHandler
                                                        }
                                                        // disabled={
                                                        //     sendingOtp ||
                                                        //     !registerData.email
                                                        // }
                                                        className="text-xs font-medium text-blue-500 transition hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        {sendingOtp
                                                            ? "Sending..."
                                                            : "Resend OTP"}
                                                    </button>
                                                    
                                                </div>
                                    )} */}

                                        </div>

                                    </div>
                                )
                            }



                            <input
                                type="password"
                                name="password"
                                onChange={InputChangeHandler}
                                value={registerData.password}
                                placeholder="Password"
                                className="w-full px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-800 text-white focus:border-[#3b82f6] outline-none"
                            />

                            <input
                                type="password"
                                name="confirmPassword"
                                onChange={InputChangeHandler}
                                value={registerData.confirmPassword}
                                placeholder="Confirm Password"
                                className="w-full px-4 py-3 rounded-lg bg-[#0b0f17] border border-gray-800 text-white focus:border-[#3b82f6] outline-none"
                            />

                            <button
                                type="submit"
                                disabled={!isEmailVerified}
                                className="w-full py-3  rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] transition font-medium text-white"
                            >
                                Create Account
                            </button>

                            <p className="text-xs text-center text-[#9ca3af]">
                                Already have an account?{" "}
                                <Link to={"/login"} className="text-[#3b82f6] hover:underline cursor-pointer">
                                    Login
                                </Link>
                            </p>

                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}