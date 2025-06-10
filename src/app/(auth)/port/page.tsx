"use client";


import { motion } from "framer-motion";

export default function Home() {
    const skills = [
        { name: "Next.js", logo: "/logos/nextjs.svg" },
        { name: "React", logo: "/logos/react.svg" },
        { name: "Angular", logo: "/logos/angular.svg" },
        { name: "Tailwind CSS", logo: "/logos/tailwind.svg" },
        { name: "JavaScript", logo: "/logos/javascript.svg" },
        { name: "Spring Boot", logo: "/logos/springboot.svg" },
        { name: "Node.js", logo: "/logos/nodejs.svg" },
        { name: "PostgreSQL", logo: "/logos/postgresql.svg" },
        { name: "MySQL", logo: "/logos/mysql.svg" },
        { name: "Java", logo: "/logos/java.svg" },
        { name: "Python", logo: "/logos/python.svg" },
        { name: "Git", logo: "/logos/git.svg" },
        { name: "GitHub", logo: "/logos/github.svg" },
        { name: "VS Code", logo: "/logos/vscode.svg" },
        { name: "IntelliJ", logo: "/logos/intellij.svg" },
    ];

    return (
        <div className="min-h-screen bg-[#100420] text-white font-sans">
            {/* Navbar */}
            <header className="flex justify-between items-center px-6 py-4 border-b border-[#2C1A3A] bg-[#0A0214]">
                <h1 className="text-2xl font-bold text-[#A259FF]">DevPortfolio</h1>
                <nav className="space-x-6">
                    <a href="#projects" className="hover:text-[#F5EEDC]">Projects</a>
                    <a href="#about" className="hover:text-[#F5EEDC]">About</a>
                    <a href="#skills" className="hover:text-[#F5EEDC]">Skills</a>
                    <a href="#contact" className="hover:text-[#F5EEDC]">Contact</a>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-32 px-6 bg-gradient-to-b from-[#14042E] to-[#100420]">
                <motion.h2
                    className="text-5xl md:text-6xl font-bold text-[#F5EEDC] mb-6"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Hi, I'm a <span className="text-[#A259FF]">Full Stack Developer</span>
                </motion.h2>
                <motion.p
                    className="text-lg text-[#BDBDBD] max-w-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    I love crafting elegant and functional web applications in dark mode, especially using deep violet and beige themes.
                </motion.p>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-6 bg-[#0A0214] text-center">
                <h3 className="text-3xl font-bold text-[#F5EEDC] mb-10">About Me</h3>
                <div className="flex flex-col items-center">
                    <motion.div
                        className="w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-[#A259FF] mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
                    </motion.div>
                    <p className="text-[#BDBDBD] max-w-2xl">
                        I'm a passionate computer science student and full stack developer in training. I enjoy working on innovative and visually appealing projects while constantly improving my skills.
                    </p>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="py-24 px-6 bg-[#100420] text-center">
                <h3 className="text-3xl font-bold text-[#F5EEDC] mb-12">Skills & Tools</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 place-items-center">
                    {skills.map((skill, i) => (
                        <motion.div
                            key={skill.name}
                            className="bg-[#1A0D2E] p-4 rounded-xl shadow-md hover:shadow-xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                            <img src={skill.logo} alt={skill.name} className="w-12 h-12 mx-auto" />
                            <p className="mt-2 text-sm text-white">{skill.name}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-24 px-6 bg-[#0A0214]">
                <h3 className="text-3xl font-bold text-[#F5EEDC] mb-10 text-center">My Projects</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-[#1A0D2E] p-6 rounded-2xl shadow-md">
                        <h4 className="text-xl font-semibold text-[#A259FF] mb-2">Project 1 - Fullstack</h4>
                        <p className="text-[#EDEDED] mb-2">A fullstack application with two versions:</p>
                        <ul className="text-sm text-[#BDBDBD] list-disc list-inside">
                            <li><a className="text-[#A259FF] hover:underline" href="https://github.com/user/backend-java">Backend Java (Spring Boot)</a></li>
                            <li><a className="text-[#A259FF] hover:underline" href="https://github.com/user/backend-node">Backend Node.js (Express)</a></li>
                        </ul>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {[1, 2, 3].map((i) => (
                                <img
                                    key={i}
                                    src={`/project1/img${i}.jpg`}
                                    alt={`Screenshot ${i}`}
                                    className="rounded-lg"
                                />
                            ))}
                        </div>
                    </div>

                    {[2, 3].map((i) => (
                        <div key={i} className="bg-[#1A0D2E] p-6 rounded-2xl shadow-md">
                            <h4 className="text-xl font-semibold text-[#A259FF] mb-2">Project {i}</h4>
                            <p className="text-[#EDEDED] mb-2">Description of project {i}.</p>
                            <a
                                href={`https://github.com/user/project${i}`}
                                className="text-[#A259FF] hover:underline"
                            >
                                GitHub Repository
                            </a>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {[1, 2, 3].map((j) => (
                                    <img
                                        key={j}
                                        src={`/project${i}/img${j}.jpg`}
                                        alt={`Project ${i} Screenshot ${j}`}
                                        className="rounded-lg"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 bg-[#100420] text-center">
                <h3 className="text-3xl font-bold text-[#F5EEDC] mb-6">Contact</h3>
                <p className="text-[#BDBDBD] mb-4">Feel free to reach out via this form or email.</p>
                <form className="max-w-md mx-auto space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-3 rounded bg-[#2C1A3A] text-white placeholder-[#999]"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded bg-[#2C1A3A] text-white placeholder-[#999]"
                    />
                    <textarea
                        placeholder="Message"
                        rows="4"
                        className="w-full p-3 rounded bg-[#2C1A3A] text-white placeholder-[#999]"
                    ></textarea>
                    <button
                        type="submit"
                        className="bg-[#A259FF] hover:bg-[#8e40e4] text-white py-2 px-6 rounded shadow-lg"
                    >
                        Send
                    </button>
                </form>
            </section>

            {/* Footer */}
            <footer className="text-center py-6 bg-[#0A0214] text-[#BDBDBD] text-sm">
                © 2025 - My Portfolio. Designed in deep violet dark mode.
            </footer>
        </div>
    );
}
