import React from 'react';
import About from './About';
import Skills from './Skills';
import Projects from './Project';
import Contact from './Contact';
import Footer from './Footer';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import myPhoto from "./assets/myPhoto.png"


export default function Home() {
    return (
        <div className="antialiased flex flex-col justify-between bg-[#0b0f17] text-white font-sans scroll-smooth">
            <Navbar />
            <main className="flex-grow">
                <section className="max-w-5xl mx-auto px-4 py-20 md:py-28 flex flex-col-reverse md:flex-row items-center justify-between gap-12 relative">

                    {/* BACKGROUND GLOW */}
                    <div className="absolute w-72 h-72 bg-[#3b82f6]/10 blur-3xl rounded-full top-10 left-10 -z-10"></div>
                    <div className="absolute w-72 h-72 bg-[#3b82f6]/10 blur-3xl rounded-full bottom-0 right-10 -z-10"></div>

                    {/* LEFT INFO */}
                    <div className="w-full md:w-3/5 text-center md:text-left">

                        <p className="text-sm font-semibold tracking-wider text-[#3b82f6] uppercase mb-2">
                            Hello, I am
                        </p>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                            Rajkumar Gupta
                        </h1>

                        <h2 className="text-xl md:text-2xl font-medium text-gray-400 mb-4">
                            Full-Stack Developer
                        </h2>

                        <p className="text-base text-gray-400 max-w-lg mb-8 leading-relaxed">
                            I build functional, clean, and responsive web applications using modern technologies. Passionate about solving backend logic challenges and processing structural datasets.
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">

                            <a
                                href="#projects"
                                className="px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-medium hover:bg-[#2563eb] transition-colors text-sm shadow-lg shadow-[#3b82f6]/20"
                            >
                                View Projects
                            </a>

                            <Link
                                to={"/contactUs"}
                                className="px-6 py-3 rounded-lg border border-gray-700 text-gray-400 font-medium hover:border-[#3b82f6] hover:text-white transition-colors text-sm"
                            >
                                Contact Me
                            </Link>

                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    {/* RIGHT IMAGE (ANIMATED UNSTRUCTURED STYLE) */}
                    <div className="w-full md:w-2/5 flex justify-center relative">

                        {/* BACKGROUND GLOW */}
                        <div className="absolute w-72 h-72 bg-[#3b82f6]/10 blur-3xl rounded-full -z-10 animate-pulse"></div>

                        {/* FLOATING BACK LAYER */}
                        <div className="absolute w-56 h-72 md:w-64 md:h-80 bg-[#3f3f41]/50 border border-gray-800 rounded-2xl rotate-[-8deg] translate-x-4 translate-y-4 animate-[float_6s_ease-in-out_infinite]"></div>

                        {/* MAIN IMAGE CARD */}
                        <div className="relative w-56 h-72 md:w-64 md:h-80 bg-[#0f172a] border border-gray-800 rounded-2xl overflow-hidden rotate-[4deg] shadow-2xl shadow-black/40 animate-[float2_5s_ease-in-out_infinite]">

                            {/* IMAGE */}
                            <img
                                src={myPhoto}
                                alt="Profile"
                                className="w-full h-full object-cover scale-110 hover:scale-105 transition-transform duration-500"
                            />

                            {/* GRADIENT OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

                            {/* SMALL ACCENT ELEMENT */}
                            <div className="absolute top-4 right-4 w-3 h-3 bg-[#3b82f6] rounded-full shadow-lg animate-ping"></div>

                        </div>

                        {/* FLOATING MINI DOT */}
                        <div className="absolute bottom-6 left-10 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>

                    </div>

                </section>
                <About />
                <Skills />
                <Projects />
                <Contact />
            </main>
            <Footer />
        </div>
    )
}