import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiHeart, FiCpu, FiAnchor, FiEye, FiSmile, FiShield, FiArrowRight, FiStar } from 'react-icons/fi';
import Hero from '../components/layout/Hero';
import servicesImg from '../assets/services.png';
import feedbackImg from '../assets/feedback.png';
import reviewImg from '../assets/review.jpg';
import human1 from '../assets/human1.jpg';
import human3 from '../assets/human3.jpg';
import human4 from '../assets/human4.jpg';

const Home = () => {
  const services = [
    { icon: FiHeart, title: 'Cardiology', description: 'Expert heart care with advanced diagnostic and treatment facilities.' },
    { icon: FiCpu, title: 'Neurology', description: 'Comprehensive neurological care for brain and nervous system disorders.' },
    { icon: FiAnchor, title: 'Orthopedics', description: 'Specialized bone and joint treatments with modern surgical techniques.' },
    { icon: FiEye, title: 'Ophthalmology', description: 'Complete eye care services from routine checkups to complex surgeries.' },
    { icon: FiSmile, title: 'Dental Care', description: 'Professional dental services for healthy smiles and oral hygiene.' },
    { icon: FiShield, title: 'Emergency Care', description: '24/7 emergency services with rapid response and critical care.' },
  ];

  const testimonials = [
    { name: 'Jennifer Adams', role: 'Patient', image: human1, text: 'The care I received at MediCare was exceptional. The doctors were attentive and the staff was incredibly supportive throughout my treatment.', rating: 5 },
    { name: 'Robert Martinez', role: 'Patient', image: human3, text: 'From diagnosis to recovery, the team at MediCare provided outstanding care. I couldn\'t have asked for a better healthcare experience.', rating: 5 },
    { name: 'Lisa Thompson', role: 'Patient', image: human4, text: 'I highly recommend MediCare for anyone seeking top-quality medical care. Their facilities are state-of-the-art and the doctors are truly experts.', rating: 5 },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <Hero />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Medical Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of specialized medical services to meet all your healthcare needs.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src={servicesImg} alt="Medical Services" className="rounded-2xl shadow-xl w-full h-auto" />
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-6"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="card group cursor-pointer"
                >
                  <div className="bg-primary-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                    <service.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="text-center">
            <Link to="/services" className="btn-primary inline-flex items-center space-x-2">
              <span>View All Services</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-50 to-medical-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from real patients about their experiences with our healthcare services.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src={reviewImg} alt="Patient Review" className="rounded-2xl shadow-lg w-full h-64 object-cover col-span-2" />
              <img src={feedbackImg} alt="Feedback" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
              <div className="bg-gradient-to-br from-primary-500 to-medical-500 rounded-2xl p-6 flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-5xl font-bold mb-2">4.9</p>
                  <div className="flex justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm">Average Rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={item} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                        <div className="flex space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-primary-600 text-sm mb-3">{testimonial.role}</p>
                      <p className="text-gray-600">{testimonial.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-600 to-medical-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Book Your Appointment?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Schedule a consultation with our expert medical team and take the first step towards better health.
            </p>
            <Link to="/login" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-block">
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
