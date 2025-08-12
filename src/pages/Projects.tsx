import { motion } from 'framer-motion'
import { ExternalLink, Github, Globe, Code, Database, Smartphone } from 'lucide-react'
import { useState } from 'react'

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
      category: 'Full Stack',
      liveUrl: 'https://ecommerce-demo.com',
      githubUrl: 'https://github.com/jhonelmira/ecommerce',
      icon: Globe,
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'TypeScript', 'Socket.io', 'Express', 'PostgreSQL'],
      category: 'Web App',
      liveUrl: 'https://task-app-demo.com',
      githubUrl: 'https://github.com/jhonelmira/task-app',
      icon: Code,
    },
    {
      title: 'Mobile Fitness Tracker',
      description: 'A React Native mobile app for tracking workouts, nutrition, and fitness goals with data visualization and social features.',
      image: '/api/placeholder/600/400',
      technologies: ['React Native', 'Firebase', 'Redux', 'Chart.js', 'Expo'],
      category: 'Mobile',
      liveUrl: 'https://fitness-app-demo.com',
      githubUrl: 'https://github.com/jhonelmira/fitness-app',
      icon: Smartphone,
    },
    {
      title: 'Data Analytics Dashboard',
      description: 'An interactive dashboard for visualizing business metrics and KPIs with real-time data updates and customizable charts.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'AWS'],
      category: 'Data',
      liveUrl: 'https://dashboard-demo.com',
      githubUrl: 'https://github.com/jhonelmira/dashboard',
      icon: Database,
    },
    {
      title: 'Social Media Clone',
      description: 'A social media platform with features like posts, comments, likes, user profiles, and real-time notifications.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'GraphQL', 'Apollo', 'MongoDB', 'AWS S3'],
      category: 'Social',
      liveUrl: 'https://social-app-demo.com',
      githubUrl: 'https://github.com/jhonelmira/social-app',
      icon: Globe,
    },
    {
      title: 'AI Chat Application',
      description: 'An AI-powered chat application with natural language processing, sentiment analysis, and intelligent responses.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'Python', 'TensorFlow', 'OpenAI API', 'WebSocket'],
      category: 'AI/ML',
      liveUrl: 'https://ai-chat-demo.com',
      githubUrl: 'https://github.com/jhonelmira/ai-chat',
      icon: Code,
    },
  ]

  const categories = ['All', 'Full Stack', 'Web App', 'Mobile', 'Data', 'Social', 'AI/ML']

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

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
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Here's a collection of projects I've worked on, showcasing my skills 
              in full-stack development, mobile apps, and innovative solutions.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Project Grid */}
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                No projects found in the "{selectedCategory}" category.
              </div>
              <button
                onClick={() => setSelectedCategory('All')}
                className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
              >
                View all projects
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                {/* Project Image */}
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/20 dark:to-purple-900/20 flex items-center justify-center">
                    <project.icon size={64} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full hover:bg-primary-100 transition-colors duration-200"
                      >
                        <ExternalLink size={20} className="text-gray-900" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full hover:bg-primary-100 transition-colors duration-200"
                      >
                        <Github size={20} className="text-gray-900" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-full">
                      {project.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex space-x-4 pt-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                      >
                        <Github size={16} className="mr-1" />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              I'm always interested in new opportunities and exciting projects. 
              Let's discuss how we can work together to bring your ideas to life.
            </p>
            <a
              href="/contact"
              className="btn-primary inline-flex items-center justify-center text-lg px-8 py-3"
            >
              Let's Collaborate
              <ExternalLink size={24} className="ml-2" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Projects
