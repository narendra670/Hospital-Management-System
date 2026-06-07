import { motion } from 'framer-motion';
import { FiHeart, FiCpu, FiAnchor, FiEye, FiSmile, FiShield, FiActivity, FiBook, FiDroplet, FiStar } from 'react-icons/fi';
import appointImg from '../assets/appoint.png';
import doctor1 from '../assets/doctor1.jpg';
import doctor2 from '../assets/doctor2.jpg';
import doct4 from '../assets/doct4.jpg';
import doctor5 from '../assets/doctor5.jpg';
import pediatrics from '../assets/pedeiatrics.jpg';
import emergencycare from '../assets/emergencycare.jpg';
import dentalcare from '../assets/dentalcare.jpg';
import generalmedicine from '../assets/generalmedicine.jpg';
import laboratory from '../assets/laboratory.jpg';

const Services = () => {
  const services = [
    { icon: FiHeart, title: 'Cardiology', description: 'Comprehensive heart care including diagnostics, treatment, and rehabilitation programs.', features: ['ECG & Echo Testing', 'Angiography', 'Cardiac Surgery', 'Rehabilitation'], image: doctor1 },
    { icon: FiCpu, title: 'Neurology', description: 'Advanced neurological care for conditions affecting the brain, spine, and nervous system.', features: ['MRI & CT Scans', 'EEG Testing', 'Stroke Treatment', 'Epilepsy Care'], image: doctor2 },
    { icon: FiAnchor, title: 'Orthopedics', description: 'Expert musculoskeletal care from sports injuries to joint replacement surgery.', features: ['Joint Replacement', 'Sports Medicine', 'Fracture Care', 'Physical Therapy'], image: doct4 },
    { icon: FiEye, title: 'Ophthalmology', description: 'Complete eye care services from routine exams to advanced surgical procedures.', features: ['LASIK Surgery', 'Cataract Treatment', 'Glaucoma Care', 'Retinal Surgery'], image: doctor5 },
    { icon: FiSmile, title: 'Dental Care', description: 'Professional dental services for all ages, from preventive care to cosmetic dentistry.', features: ['Cleanings', 'Root Canal', 'Teeth Whitening', 'Orthodontics'], image: dentalcare },
    { icon: FiShield, title: 'Emergency Care', description: 'Round-the-clock emergency services with rapid response and critical care units.', features: ['24/7 Available', 'Trauma Center', 'Ambulance Service', 'ICU Care'], image: emergencycare },
    { icon: FiBook, title: 'General Medicine', description: 'Comprehensive primary care for routine checkups and common medical conditions.', features: ['Health Screenings', 'Chronic Disease Care', 'Vaccinations', 'Preventive Care'], image: generalmedicine },
    { icon: FiActivity, title: 'Laboratory Services', description: 'State-of-the-art diagnostic laboratory with quick and accurate test results.', features: ['Blood Tests', 'Pathology', 'Microbiology', 'Quick Results'], image: laboratory },
    { icon: FiStar, title: 'Pediatrics', description: 'Specialized healthcare for infants, children, and adolescents with compassionate care.', features: ['Well-Child Visits', 'Immunizations', 'Growth Monitoring', 'Pediatric Emergency'], image: pediatrics },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Medical Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of medical services designed to meet all your healthcare needs under one roof.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src={appointImg} alt="Book Appointment" className="rounded-2xl shadow-xl w-full h-auto" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Book Your Appointment Today</h2>
              <p className="text-lg text-gray-600 mb-6">
                Schedule a consultation with our expert medical team. We're committed to providing you with the best healthcare experience.
              </p>
              <ul className="space-y-4 mb-8">
                {['Expert Medical Professionals', 'State-of-the-Art Facilities', 'Personalized Treatment Plans', '24/7 Emergency Support'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="bg-medical-100 p-2 rounded-full">
                      <svg className="w-5 h-5 text-medical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <a href="/login" className="btn-primary inline-flex items-center">
                Get Started
              </a>
            </motion.div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={item} className="card overflow-hidden group">
                {service.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="bg-primary-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 -mt-10 relative z-10 shadow-lg">
                    <service.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-medical-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
