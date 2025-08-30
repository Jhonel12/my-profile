import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Globe, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const skills = [
    {
      icon: Code,
      title: "Frontend Development",
      description: "React, TypeScript, Next.js, Tailwind CSS",
    },
    {
      icon: Database,
      title: "Backend Development",
      description: "Node.js, Express, Python, Django",
    },
    {
      icon: Globe,
      title: "Full Stack",
      description: "MongoDB, PostgreSQL, AWS, Docker",
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "React Native, Flutter",
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Hi, I'm <span className="gradient-text">Jhonel G. Mira</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Full Stack Developer passionate about creating innovative web
                solutions and turning ideas into reality through clean,
                efficient code.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  View My Work
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  Get In Touch
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Profile Image */}
              <div className="relative mb-8 group">
                <div className="w-64 h-64 mx-auto relative transition-transform duration-300 transform group-hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full p-1 transition-all duration-300 group-hover:rotate-6">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-dark-800 p-1">
                      <img
                        src="/profile-image.jpg" // Replace with your image path
                        alt="Jhonel G. Mira"
                        className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/256x256/3b82f6/ffffff?text=JG";
                        }}
                      />
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <span className="text-xs font-bold text-gray-900">✨</span>
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-1 group-hover:translate-y-1">
                    <span className="text-xs font-bold text-white">🚀</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">
                    Let's Build Something Amazing
                  </h3>
                  <p className="text-primary-100">
                    I specialize in creating modern, scalable web applications
                    that deliver exceptional user experiences.
                  </p>
                  {/* <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm">
                      Trusted by developers worldwide
                    </span>
                  </div> */}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-padding bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What I Do</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              I specialize in full-stack development, creating robust and
              scalable applications that solve real-world problems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/40 transition-colors duration-200">
                  <skill.icon
                    size={32}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {skill.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's collaborate to bring your ideas to life. I'm here to help
              you create something extraordinary.
            </p>
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center justify-center text-lg px-8 py-3"
            >
              Let's Talk
              <ArrowRight size={24} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
