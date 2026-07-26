import React, { useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ContextAPIData } from "./ContextData/ContentAPIData";
import Loading from "./Loading";
import { Navigate } from "react-router-dom";

export default function Settings() {
   const {currentUser, isLoading, adminToken}=useContext(ContextAPIData)
    if(isLoading){
        return <Loading/>
    }
    if(!currentUser && !adminToken){
        return <Navigate to={"/login"} state={{warning:"Login to access dashboard"}}/>
    }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 space-y-10">

        <h1 className="text-3xl font-bold">Settings</h1>

        {/* PROFILE */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold">Profile</h2>

          <input
            placeholder="Full Name"
            className="w-full p-3 bg-zinc-800 rounded-lg outline-none"
          />

          <input
            placeholder="Tagline"
            className="w-full p-3 bg-zinc-800 rounded-lg outline-none"
          />

          <textarea
            placeholder="Bio"
            rows="3"
            className="w-full p-3 bg-zinc-800 rounded-lg outline-none"
          />
        </section>

        {/* SOCIAL LINKS */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold">Social Links</h2>

          <input placeholder="GitHub" className="w-full p-3 bg-zinc-800 rounded-lg outline-none" />
          <input placeholder="LinkedIn" className="w-full p-3 bg-zinc-800 rounded-lg outline-none" />
          <input placeholder="Twitter / X" className="w-full p-3 bg-zinc-800 rounded-lg outline-none" />
        </section>

        {/* APPEARANCE */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Appearance</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Customize the interface to match your preferences.
            </p>
          </div>

          <div className="space-y-5">

            {/* Theme */}
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <div>
                <p className="font-medium text-zinc-100">Theme</p>
                <p className="text-xs text-zinc-500">Choose your preferred theme.</p>
              </div>

              <select className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                <option>System</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <div>
                <p className="font-medium text-zinc-100">Font Size</p>
                <p className="text-xs text-zinc-500">Adjust text readability.</p>
              </div>

              <select className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>

            {/* Layout Density */}
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <div>
                <p className="font-medium text-zinc-100">Layout Density</p>
                <p className="text-xs text-zinc-500">Control spacing between elements.</p>
              </div>

              <select className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                <option>Comfortable</option>
                <option>Compact</option>
              </select>
            </div>

            {/* Accent Color */}
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <div>
                <p className="font-medium text-zinc-100">Accent Color</p>
                <p className="text-xs text-zinc-500">Used for buttons and highlights.</p>
              </div>

              <select className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                <option>Blue</option>
                <option>Purple</option>
                <option>Green</option>
                <option>Orange</option>
              </select>
            </div>

          </div>
        </section>

        {/* PRIVACY */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
  <div className="mb-6">
    <h2 className="text-lg font-semibold text-white">Privacy</h2>
    <p className="mt-1 text-sm text-zinc-400">
      Manage who can view your profile and personal information.
    </p>
  </div>

  <div className="space-y-5">

    {/* Profile Visibility */}
    <div className="grid grid-cols-[170px_1fr] items-center gap-4">
      <div>
        <p className="font-medium text-zinc-100">Profile Visibility</p>
        <p className="text-xs text-zinc-500">
          Choose who can see your profile.
        </p>
      </div>

      <select className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
        <option>Public</option>
        <option>Private</option>
        <option>Connections Only</option>
      </select>
    </div>

    {/* Email Visibility */}
    <div className="grid grid-cols-[170px_1fr] items-center gap-4">
      <div>
        <p className="font-medium text-zinc-100">Email Visibility</p>
        <p className="text-xs text-zinc-500">
          Control who can view your email address.
        </p>
      </div>

      <select className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
        <option>Only Me</option>
        <option>Connections</option>
        <option>Everyone</option>
      </select>
    </div>

    {/* Search Visibility */}
    <div className="grid grid-cols-[170px_1fr] items-center gap-4">
      <div>
        <p className="font-medium text-zinc-100">Search Visibility</p>
        <p className="text-xs text-zinc-500">
          Allow your profile to appear in search results.
        </p>
      </div>

      <select className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
        <option>Enabled</option>
        <option>Disabled</option>
      </select>
    </div>

  </div>
</section>

        {/* SAVE BUTTON */}
        <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] py-3 rounded-lg font-medium transition">
          Save Changes
        </button>

      </main>

      <Footer />
    </div>
  );
}