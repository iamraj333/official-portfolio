import React from "react";
import { Link } from "react-router-dom";

export default function NoInternet() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0b0f17] text-white overflow-hidden py-6">

            <main className="flex-grow flex items-center justify-center px-4 relative">

                {/* Background Glows */}
                <div className="absolute top-20 left-10 w-80 h-80 bg-[#3b82f6]/10 blur-3xl rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#06b6d4]/10 blur-3xl rounded-full"></div>

                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">

                    {/* Offline Icon */}
                    <div className="relative mb-8">

                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                            <span className="text-6xl md:text-7xl">
                                📡
                            </span>
                        </div>

                        <div className="absolute inset-0 bg-[#3b82f6]/20 blur-3xl rounded-full"></div>

                    </div>


                    {/* Heading */}
                    <h1 className="text-4xl md:text-6xl font-black mb-4">
                        No Internet Connection
                    </h1>


                    {/* Description */}
                    <p className="text-gray-400 max-w-2xl text-base md:text-lg leading-relaxed mb-12">
                        You're currently offline. Check your internet connection
                        and try again. Once you're connected, we'll get you back
                        on track.
                    </p>


                    {/* Floating Card Design */}
                    <div className="relative w-72 h-44 md:w-96 md:h-56 mb-12">

                        {/* Back Card */}
                        <div className="absolute inset-0 bg-[#1f2937]/40 border border-gray-800 rounded-2xl rotate-[-8deg] translate-x-5 translate-y-5"></div>


                        {/* Main Card */}
                        <div className="relative h-full bg-[#0f172a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 rotate-[4deg]">

                            {/* Status Dot */}
                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>


                            <div className="h-full flex flex-col items-center justify-center px-6">

                                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                                    <span className="text-3xl">
                                        🌐
                                    </span>
                                </div>


                                <h3 className="font-semibold text-lg mb-2">
                                    Connection Lost
                                </h3>


                                <p className="text-gray-400 text-sm">
                                    Unable to reach the server right now.
                                </p>

                            </div>

                        </div>


                        {/* Floating Dot */}
                        <div className="absolute -left-4 bottom-4 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>

                    </div>


                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">

                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 rounded-lg bg-[#3b82f6] text-white font-medium hover:bg-[#2563eb] transition-colors shadow-lg shadow-[#3b82f6]/20"
                        >
                            Try Again
                        </button>


                        <Link
                            to="/"
                            className="px-8 py-3 rounded-lg border border-gray-700 text-gray-400 font-medium hover:border-[#3b82f6] hover:text-white transition-colors"
                        >
                            Back To Home
                        </Link>

                    </div>


                    {/* Footer Text */}
                    <p className="mt-10 text-xs tracking-widest uppercase text-gray-600">
                        Network Error • Please Check Your Connection
                    </p>

                </div>

            </main>
        </div>
    );
}