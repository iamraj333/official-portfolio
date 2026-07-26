// Loading.jsx
import React from "react";

export default function Loading({ text = "Loading..." }) {
    return (
        <div className="fixed inset-0 bg-[#0b0f17]/90 backdrop-blur-sm flex flex-col items-center justify-center z-[200]">
            
            {/* Spinner */}
            <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full"></div>

                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            {/* Text */}
            <p className="mt-5 text-gray-300 text-lg font-medium">
                {text}
            </p>

            {/* Sub text */}
            <p className="text-gray-500 text-sm mt-1">
                Please wait...
            </p>
        </div>
    );
}