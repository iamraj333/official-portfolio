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
    <section
      id="skills"
      className="border-t border-gray-800 py-24 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="mb-14">
          <p className="text-blue-500 uppercase tracking-[0.3em] text-xs font-semibold mb-3">
            My Expertise
          </p>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Technical Skills
          </h2>

          <div className="h-1 w-16 bg-blue-500 mt-4 rounded-full"></div>
        </div>


        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {skillGroups.map((group, idx) => (
            <div
              key={idx}
              className="
                group relative
                rounded-2xl
                border border-gray-800
                bg-gray-900/30
                backdrop-blur-sm
                p-6
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-500/60
                hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]
              "
            >

              {/* Card Glow */}
              <div
                className="
                  absolute inset-0 rounded-2xl
                  bg-blue-500/5
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-300
                "
              />


              <div className="relative">

                {/* Category */}
                <h3
                  className="
                    text-sm
                    font-bold
                    uppercase
                    tracking-widest
                    text-blue-500
                    mb-5
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {group.title}
                </h3>


                {/* Skills */}
                <div className="flex flex-wrap gap-2">

                  {group.items.map((item, i) => (
                    <span
                      key={i}
                      className="
                        px-3
                        py-1.5
                        text-xs
                        rounded-lg
                        border
                        border-gray-700
                        bg-gray-800/60
                        text-gray-300
                        transition-all
                        duration-300
                        hover:text-white
                        hover:border-blue-500/70
                        hover:bg-blue-500/10
                        hover:-translate-y-1
                      "
                    >
                      {item}
                    </span>
                  ))}

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}