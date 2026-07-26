import React from 'react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const customProjects = [
    {
      title: "Cleaning Service Platform",
      desc: "Developed a full-stack cleaning service web application with appointment booking, user authentication, email integration, and a blog management system for verified users using Django.",
      github: "https://github.com/iamraj333/Cleanza-Cleaning-Service-Provider-Platform-Django-"
    },
    {
      title: "Crane Service Website",
      desc: "Developed a responsive frontend website for a crane service company using HTML, CSS, and JavaScript, featuring service information, equipment showcase, contact forms, and an intuitive user interface.",
      github: "https://github.com/your-username/crane-service-website"
    },
    {
      title: "Employee Task Management System",
      desc: "Built a React-based task management application with role-based admin and employee dashboards, task assignment, progress tracking, and persistent data storage using LocalStorage.",
      github: "https://github.com/your-username/employee-task-management"
    }
  ];

  return (
    <section id="projects" className="border-t border-gray-800 bg-[#0f172a]/40 py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customProjects.map((project, index) => (
            <div key={index} className='relative'>
              <div  className=" relative w-full h-full z-[10] bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col justify-between transition-all duration-300 md:hover:border-2 md:hover:-translate-y-2 md:hover:-translate-x-2">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{project.desc}</p>
                </div>
                <div className="mt-4">
                  <Link to={project.github} className="inline-flex items-center gap-2 text-xs font-medium text-[#3b82f6] hover:underline">
                    View GitHub Source
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className='z-0 absolute inset-0 w-full h-full bg-zinc-200 rounded-2xl'>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}