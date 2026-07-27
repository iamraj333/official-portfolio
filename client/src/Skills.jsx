import React from "react";

export default function Skills() {
  const skills = [
    {
      title: "Languages",
      items: ["JavaScript", "Python", "C++"],
    },
    {
      title: "Frontend",
      items: [
        "React JS",
        "HTML5",
        "CSS3",
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
      items: ["NumPy", "Pandas", "Matplotlib"],
    },
    {
      title: "Tools",
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
        "CRUD",
        "OOP",
        "Data Structures",
      ],
    },
    {
      title: "Professional",
      items: ["Problem Solving", "Team Collaboration"],
    },
  ];

  return (
    <section
      id="skills"
      className="py-24 border-t border-neutral-800 bg-[#0a0a0a]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-blue-500 text-sm uppercase tracking-[0.25em] mb-3">
            Expertise
          </p>

          <h2 className="text-4xl font-bold text-white">
            Skills & Technologies
          </h2>

          <p className="mt-4 max-w-2xl text-gray-400">
            Technologies and tools I use to build scalable web applications,
            APIs, and data-driven solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {skills.map((group) => (
            <div
              key={group.title}
              className="border-b border-neutral-800 pb-8"
            >
              <h3 className="text-lg font-semibold text-white mb-5">
                {group.title}
              </h3>

              <div className="flex flex-wrap gap-3">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full border border-neutral-700 text-sm text-gray-300 hover:border-blue-500 hover:text-white transition-all duration-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}