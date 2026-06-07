import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiTarget, FiHeart } from 'react-icons/fi';
import aboutUs from '../assets/AboutUs.jpg';
import doctor1 from '../assets/doctor1.jpg';
import doct2 from '../assets/doct2.jpg';
import doct3 from '../assets/doct3.jpg';
import doctor5 from '../assets/doctor5.jpg';

const About = () => {
  const stats = [
    { icon: FiAward, number: '25+', label: 'Years Experience' },
    { icon: FiUsers, number: '50+', label: 'Expert Doctors' },
    { icon: FiTarget, number: '100K+', label: 'Patients Treated' },
    { icon: FiHeart, number: '98%', label: 'Satisfaction Rate' },
  ];

  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Chief Medical Officer', specialty: 'Cardiology', image: doctor1 },
    { name: 'Dr. Michael Chen', role: 'Head of Neurology', specialty: 'Neurology', image: doct2 },
    { name: 'Dr. Emily Williams', role: 'Senior Surgeon', specialty: 'Orthopedics', image: doct3 },
    { name: 'Dr. James Wilson', role: 'Emergency Director', specialty: 'Emergency Medicine', image: doctor5 },
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
      <section className="bg-gradient-to-br from-primary-50 to-medical-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About MediCare</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              For over 25 years, MediCare has been at the forefront of healthcare excellence, providing compassionate care and innovative medical solutions to our community.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg mb-6">
                To deliver exceptional healthcare services that improve the quality of life for every patient we serve. We are committed to providing accessible, affordable, and high-quality medical care.
              </p>
              <p className="text-gray-600 text-lg mb-6">
                Our state-of-the-art facilities, combined with our team of highly skilled medical professionals, ensure that every patient receives personalized attention and the best possible treatment.
              </p>
              <ul className="space-y-4">
                {['Patient-centered care approach', 'Advanced medical technology', 'Experienced medical professionals', '24/7 emergency services'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="bg-medical-100 p-2 rounded-full">
                      <svg className="w-5 h-5 text-medical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img src={aboutUs} alt="About MediCare" className="rounded-2xl shadow-2xl w-full h-auto object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 2).map((stat, index) => (
                    <div key={index} className="text-center">
                      <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{stat.number}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our team of experienced medical professionals is dedicated to providing the highest quality care.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div key={index} variants={item} className="card text-center overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-1">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.specialty}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
