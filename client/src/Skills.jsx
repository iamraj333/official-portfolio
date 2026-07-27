import React from "react";

export default function Skills() {
  const skillGroups = [
    {
      title: "Programming",
      items: ["JavaScript", "Python", "C++"],
    },
    {
      title: "Frontend",
      items: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "React JS",
        "Tailwind CSS",
        "Bootstrap",
      ],
    },
    {
      title: "Backend",
      items: ["Node.js", "Express.js", "Django"],
    },
    {
      title: "Database",
      items: ["MongoDB", "MySQL", "Redis", "MongoDB Atlas"],
    },
    {
      title: "Data Analysis",
      items: [
        "NumPy",
        "Pandas",
        "Matplotlib",
        "Django Models",
      ],
    },
    {
      title: "Tools & Technologies",
      items: [
        "Git",
        "GitHub",
        "Docker",
        "CI/CD",
        "VS Code",
        "Postman",
        "Cloudinary",
      ],
    },
    {
      title: "Concepts",
      items: [
        "REST APIs",
        "JWT Authentication",
        "CRUD Operations",
        "Object-Oriented Programming",
        "Data Structures",
      ],
    },
    {
      title: "Professional Skills",
      items: [
        "Problem Solving",
        "Team Collaboration",
      ],
    },
  ];

  return (
    <section id="skills" className="border-t border-gray-800 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12">
          Technical Skills
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillGroups.map((group, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-gray-800 bg-gray-900/20 p-5 hover:border-blue-500/50 transition-all duration-300"
            >
              <h3 className="text-sm font-semibold text-blue-500 tracking-wider uppercase mb-4 transition-all duration-300 group-hover:-translate-x-2">
                {group.title}
              </h3>

              <ul className="space-y-3 text-sm text-gray-400">
                {group.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-[var(--tx)]"
                    style={{
                      "--tx": `${i % 2 === 0 ? 8 : -8}px`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {item}
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