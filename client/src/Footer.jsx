import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0b0f17] py-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Official Portfolio - Rajkumar Gupta
        </p>
        <div className="flex items-center space-x-6 text-xs font-medium text-gray-400">
          <Link to={"https://github.com/iamraj333"} className="hover:text-[#3b82f6] transition-colors">GitHub</Link>
          <Link to={"https://Linkedin.com/in/guptarajkumar"} className="hover:text-[#3b82f6] transition-colors">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}