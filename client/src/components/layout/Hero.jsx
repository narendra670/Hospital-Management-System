import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiClock, FiUsers } from 'react-icons/fi';
import heroImage from '../../assets/hero.png';
import doctor1 from '../../assets/doctor1.jpg';
import doctor2 from '../../assets/doctor2.jpg';
import doctor4 from '../../assets/doctor4.jpg';

const Hero = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-medical-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-medical-200 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={item}
              className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              Welcome to MediCare Hospital
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Your Health Is Our{' '}
              <span className="bg-gradient-to-r from-primary-600 to-medical-600 bg-clip-text text-transparent">
                Top Priority
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Experience world-class healthcare with our team of expert physicians, cutting-edge technology, and compassionate care available 24/7.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login" className="btn-primary flex items-center justify-center space-x-2">
                <span>Book Appointment</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/services" className="btn-outline flex items-center justify-center">
                Our Services
              </Link>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              {[
                { icon: FiShield, number: '50+', label: 'Expert Doctors' },
                { icon: FiClock, number: '24/7', label: 'Emergency Care' },
                { icon: FiUsers, number: '10K+', label: 'Happy Patients' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stat.number}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src={heroImage} alt="Medical Team" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent"></div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 flex items-center space-x-3">
                <div className="flex -space-x-3">
                  <img src={doctor1} alt="Doctor" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                  <img src={doctor2} alt="Doctor" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                  <img src={doctor4} alt="Doctor" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-sm">50+ Doctors</p>
                  <p className="text-xs text-gray-500">Available 24/7</p>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-medical-100 p-2 rounded-lg">
                    <FiClock className="w-5 h-5 text-medical-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">24/7</p>
                    <p className="text-xs text-gray-500">Emergency</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
