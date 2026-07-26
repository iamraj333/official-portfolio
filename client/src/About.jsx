import React from 'react';

export default function About() {
  const points = [
    { title: "MERN Stack", desc: "Building modular SPAs using MongoDB, Express, React, and Node.js." },
    { title: "Python Foundations", desc: "Strong understanding of Python programming with hands-on experience in Django web development and backend application development."},
    { title: "Data Analysis", desc: "Basic array manipulation and structural processing using NumPy & Pandas." },
    { title: "Web Fundamentals", desc: "Semantic HTML5, semantic styling with layout controls, and vanilla DOM scripting." }
  ];

  return (
    <section id="about" className="border-t border-gray-800 bg-[#0f172a]/40 py-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">About Me</h2>
          <p className="text-base text-gray-400 leading-relaxed">
            I am a junior-to-intermediate software developer specialized in full-stack web applications and core web systems. I enjoy translating complex user requirements into performant, clean code blueprints while ensuring seamless UI responsiveness across devices.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((point, index) => (
            <div key={index} className="bg-[#111827] border border-gray-800 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border hover:border-[#3b82f6]">
              <h3 className="text-base font-semibold text-white mb-2">{point.title}</h3>
              <p className="text-sm text-gray-400">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}