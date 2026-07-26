// 404PageNotFound.jsx

import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageNotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0b0f17] text-white overflow-hidden">
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 relative">

                {/* Background Glows */}
                <div className="absolute top-20 left-10 w-80 h-80 bg-[#3b82f6]/10 blur-3xl rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#3b82f6]/10 blur-3xl rounded-full"></div>

                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">

                    {/* 404 Number */}
                    <div className="relative mb-6">
                        <h1 className="text-[120px] md:text-[220px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-blue-400 to-cyan-300">
                            404
                        </h1>

                        <div className="absolute inset-0 blur-3xl bg-[#3b82f6]/20 rounded-full"></div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Page Not Found
                    </h2>

                    {/* Description */}
                    <p className="text-gray-400 max-w-2xl text-base md:text-lg leading-relaxed mb-12">
                        The page you're looking for doesn't exist, may have been
                        moved, or the URL might be incorrect. Let's get you back
                        to something useful.
                    </p>

                    {/* Floating Card Design */}
                    <div className="relative w-72 h-44 md:w-96 md:h-56 mb-12">

                        {/* Back Card */}
                        <div className="absolute inset-0 bg-[#1f2937]/40 border border-gray-800 rounded-2xl rotate-[-8deg] translate-x-5 translate-y-5"></div>

                        {/* Main Card */}
                        <div className="relative h-full bg-[#0f172a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 rotate-[4deg]">

                            {/* Blue Dot */}
                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#3b82f6] animate-ping"></div>

                            {/* Content */}
                            <div className="h-full flex flex-col items-center justify-center px-6">

                                <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center mb-4">
                                    <span className="text-3xl">🚀</span>
                                </div>

                                <h3 className="font-semibold text-lg mb-2">
                                    Lost in Space?
                                </h3>

                                <p className="text-gray-400 text-sm">
                                    This route couldn't be found on the server.
                                </p>

                            </div>
                        </div>

                        {/* Floating Dot */}
                        <div className="absolute -left-4 bottom-4 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">

                        <Link
                            to="/"
                            className="px-8 py-3 rounded-lg bg-[#3b82f6] text-white font-medium hover:bg-[#2563eb] transition-colors shadow-lg shadow-[#3b82f6]/20"
                        >
                            Back To Home
                        </Link>

                        <Link
                            to="/contactUs"
                            className="px-8 py-3 rounded-lg border border-gray-700 text-gray-400 font-medium hover:border-[#3b82f6] hover:text-white transition-colors"
                        >
                            Contact Me
                        </Link>

                    </div>

                    {/* Footer Text */}
                    <p className="mt-10 text-xs tracking-widest uppercase text-gray-600">
                        Error Code 404 • Resource Not Found
                    </p>

                </div>
            </main>

            <Footer />
        </div>
    );
}