import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { FaUserCircle } from "react-icons/fa";
import { ContextAPIData } from "./ContextData/ContentAPIData";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const { isUserHasToken, adminToken } = useContext(ContextAPIData);
    const userData = useContext(ContextAPIData);
    const currentUser = useContext(ContextAPIData)

    const menuRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const closeMenu = () => {
        setOpen(false);
        setUserMenuOpen(false);
    };

    return (
        <header className="w-full border-b border-gray-800 sticky top-0 bg-[#0b0f17]/95 backdrop-blur z-[201]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* LOGO */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="font-bold text-xl tracking-tight text-white"
                >
                    Raj<span className="text-blue-500">.</span>Craft
                </Link>

                {/* MOBILE HAMBURGER */}
                <button
                    className="md:hidden text-white text-2xl"
                    onClick={() => setOpen(!open)}
                >
                    {open ? "✕" : "☰"}
                </button>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">

                    <HashLink
                        smooth
                        to="/#about"
                        className="hover:text-white transition"
                    >
                        About
                    </HashLink>

                    <HashLink
                        smooth
                        to="/#skills"
                        className="hover:text-white transition"
                    >
                        Skills
                    </HashLink>

                    <HashLink
                        smooth
                        to="/#projects"
                        className="hover:text-white transition"
                    >
                        Projects
                    </HashLink>

                    <HashLink
                        smooth
                        to="/blogs"
                        className="hover:text-white transition"
                    >
                        Blogs
                    </HashLink>


                    {/* USER MENU */}
                    {(isUserHasToken || adminToken) ? (
                        <div ref={menuRef} className="relative">

                            <button
                                onClick={() =>
                                    setUserMenuOpen(!userMenuOpen)
                                }
                                className="text-3xl text-gray-300 hover:text-white transition"
                            >
                                <FaUserCircle />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-[#111827] border border-gray-700 rounded-xl shadow-2xl overflow-hidden">

                                    <div className="px-4 py-3 border-b border-gray-700">
                                        <p className="text-white font-medium">
                                            {adminToken?"Admin":currentUser?.currentUser?.name}
                                        </p>

                                        <p className="text-xs text-gray-400 truncate">
                                            {currentUser?.currentUser?.email}
                                        </p>
                                    </div>

                                    {
                                        !adminToken ? <Link
                                            to="/dashboard"
                                            className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
                                            onClick={closeMenu}
                                        >
                                            Dashboard
                                        </Link> : <Link
                                            to="/admin"
                                            className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
                                            onClick={closeMenu}
                                        >
                                            Admin Panel
                                        </Link>
                                    }


                                    {/* <Link
                                        to="/settings"
                                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
                                        onClick={closeMenu}
                                    >
                                        Settings
                                    </Link> */}

                                    <div className=" border-gray-700" />

                                    <NavLink
                                        to="/logout"
                                        className="block px-4 py-3 text-red-400 hover:bg-gray-800"
                                        onClick={closeMenu}
                                    >
                                        Logout
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <NavLink
                                to="/register"
                                className="hover:text-white transition"
                            >
                                Register
                            </NavLink>

                            <NavLink
                                to="/login"
                                className="hover:text-white transition"
                            >
                                Login
                            </NavLink>
                        </>
                    )}

                    <Link
                        to="/contactUs"
                        className="px-5 py-2 rounded-full bg-zinc-500/30 border border-gray-700 text-gray-100 hover:border-blue-500 hover:text-white transition"
                    >
                        Contact Me
                    </Link>
                </nav>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <div className="md:hidden px-4 py-4 bg-[#0b0f17]  border-gray-800 space-y-4 text-sm font-medium text-gray-400">

                    <HashLink
                        smooth
                        to="/#about"
                        onClick={closeMenu}
                        className="block hover:text-white"
                    >
                        About
                    </HashLink>

                    <HashLink
                        smooth
                        to="/#skills"
                        onClick={closeMenu}
                        className="block hover:text-white"
                    >
                        Skills
                    </HashLink>

                    <HashLink
                        smooth
                        to="/#projects"
                        onClick={closeMenu}
                        className="block hover:text-white"
                    >
                        Projects
                    </HashLink>

                    <HashLink
                        smooth
                        to="/blogs"
                        onClick={closeMenu}
                        className="block hover:text-white"
                    >
                        Blogs
                    </HashLink>

                    <div className="border-t border-gray-700 pt-4">

                        {(isUserHasToken || adminToken) ? (
                            <>
                                <div className="mb-3">
                                    <p className="text-white font-medium">
                                        {adminToken?"Admin":currentUser?.currentUser?.name}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        {userData?.userData?.email}
                                    </p>
                                </div>

                                {
                                    !adminToken ? <Link
                                        to="/dashboard"
                                        onClick={closeMenu}
                                        className="block py-2 hover:text-white"
                                    >
                                        Dashboard
                                    </Link> : <Link
                                        to="/admin"
                                        onClick={closeMenu}
                                        className="block py-2 hover:text-white"
                                    >
                                        Admin Panel
                                    </Link>
                                }

                                {/* <Link
                                    to="/settings"
                                    onClick={closeMenu}
                                    className="block py-2 hover:text-white"
                                >
                                    Settings
                                </Link> */}

                                <NavLink
                                    to="/logout"
                                    onClick={closeMenu}
                                    className="block py-2 text-red-400"
                                >
                                    Logout
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/register"
                                    onClick={closeMenu}
                                    className="block py-2 hover:text-white"
                                >
                                    Register
                                </NavLink>

                                <NavLink
                                    to="/login"
                                    onClick={closeMenu}
                                    className="block py-2 hover:text-white"
                                >
                                    Login
                                </NavLink>
                            </>
                        )}
                    </div>

                    <Link
                        to="/contactUs"
                        onClick={closeMenu}
                        className="block mt-4 text-center px-5 py-3 rounded-lg bg-zinc-500/30 border border-gray-700 text-gray-100 hover:border-blue-500 hover:text-white transition"
                    >
                        Contact Me
                    </Link>
                </div>
            )}
        </header>
    );
}