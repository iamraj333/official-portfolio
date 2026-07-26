import React from 'react';

export default function Skills() {
  const skillGroups = [
    {
      title: "Frontend",
      items: ["HTML5 & CSS3", "JavaScript (ES6+)", "React Basic Hooks", "Tailwind CSS Framework"]
    },
    {
      title: "Backend",
      items: ["Node.js Ecosystem", "Express.js Framework", "REST API Routing", "Basic Authentication"]
    },
    {
      title: "Database",
      items: ["MongoDB CRUD", "Mongoose Schemas", "Basic SQL Querying"]
    },
    {
      title: "Python & Data",
      items: ["Python Logic & Scripts", "NumPy Matrix Ops", "Pandas DataFrames", "Django for Web Dev", "Git Version Control"]
    }
  ];

  return (
    <section id="skills" className="border-t border-gray-800 py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12">Technical Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillGroups.map((group, idx) => (
            <div key={idx} className='group'>
              <h3 className="text-sm font-semibold text-[#3b82f6] tracking-wider uppercase mb-4 transition-all duration-300 lg:group-hover:-translate-x-2">{group.title}</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {group.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-[var(--tx)]"  style={{ "--tx": `${(i%2==0)? 10 : (-10)}px` }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] "></span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}