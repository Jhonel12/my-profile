import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
} from "lucide-react";

const About = () => {
  const experiences = [
    {
      title: "Full Stack Developer",
      company: "DMW Region 10",
      period: "2025 - Present",
      description:
        "Building and maintaining full-stack applications using React.js for the frontend and Laravel with MySQL for the backend to support government systems and operations.",
    },

    {
      title: "Full Stack Developer",
      company: "DOLE Cagayan de Oro Field Office",
      period: "2024",
      description:
        "Developing and managing full-stack applications to support internal operations, utilizing React.js for the frontend and Laravel with MySQL for the backend.",
    },

    {
      title: "Junior Web Developer (OJT Internship)",
      company: "CK",
      period: "March 2024 - May 2024",
      description:
        "Worked on full-stack web development using Laravel and Blade templating for the frontend, contributing to building and maintaining web applications during the internship.",
    },
  ];

  const education = [
    {
      degree: "Bachelor of Science in Information Technology (BSIT)",
      school: "Capitol University",
      period: "2019 - 2024",
      description:
        "Completed the BSIT program with a focus on software development, web technologies, and full-stack application development.",
    },
  ];

  const skills = [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "Python", level: 75 },
    { name: "Laravel", level: 80 },
    { name: "MySQL", level: 85 },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="gradient-text">Me</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              I'm a passionate Full Stack Developer with over 2 years of
              experience creating innovative web solutions. I love turning
              complex problems into simple, beautiful, and intuitive designs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Profile Image for About Page */}
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="relative">
                  <div className="w-48 h-48 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full p-1">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-dark-800 p-1">
                        <img
                          src="/profile-image.jpg" // Replace with your image path
                          alt="Jhonel G. Mira"
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            // Fallback to placeholder if image doesn't load
                            e.currentTarget.src =
                              "https://via.placeholder.com/192x192/3b82f6/ffffff?text=JG";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Based in Cagayan de Oro City, Philippines
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Available for freelance opportunities
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    2+ years of coding experience
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                I'm a dedicated developer passionate about writing clean,
                maintainable code and building user experiences that matter. I
                am constantly self-learning, exploring new technologies, and
                improving my skills. Outside of coding, I enjoy contributing to
                open-source projects and sharing knowledge with the developer
                community.
              </p>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Technical Skills
              </h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section-padding bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Work <span className="gradient-text">Experience</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Briefcase
                      size={24}
                      className="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                      {exp.company}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {exp.description}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {exp.period}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Education</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap
                    size={32}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {edu.degree}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                  {edu.school}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {edu.description}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {edu.period}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
