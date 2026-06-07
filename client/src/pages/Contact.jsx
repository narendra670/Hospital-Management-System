import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import human1 from '../assets/human1.jpg';
import human3 from '../assets/human3.jpg';
import human4 from '../assets/human4.jpg';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    { icon: FiMapPin, title: 'Address', content: '123 Healthcare Street, Medical City, MC 10001' },
    { icon: FiPhone, title: 'Phone', content: '+1 (555) 123-4567' },
    { icon: FiMail, title: 'Email', content: 'contact@medicare.com' },
    { icon: FiClock, title: 'Working Hours', content: 'Mon - Sat: 8:00 AM - 8:00 PM' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-50 to-medical-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or need assistance? We are here to help. Get in touch with us.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-medical-50 border border-medical-200 rounded-xl p-8 text-center"
                  >
                    <div className="bg-medical-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiSend className="w-8 h-8 text-medical-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-medical-700 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for contacting us. We will get back to you shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                        className="input-field"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your Phone"
                        className="input-field"
                      />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        required
                        className="input-field"
                      />
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      required
                      rows={6}
                      className="input-field resize-none"
                    ></textarea>
                    <button type="submit" className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2">
                      <FiSend className="w-5 h-5" />
                      <span>Send Message</span>
                    </button>
                  </form>
                )}
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
                {contactInfo.map((info, index) => (
                  <div key={index} className="card flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <info.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      <p className="text-gray-600">{info.content}</p>
                    </div>
                  </div>
                ))}

                <div className="bg-gradient-to-br from-primary-500 to-medical-500 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">Emergency Contact</h3>
                  <p className="text-white/90 mb-4">For emergencies, call our 24/7 hotline:</p>
                  <p className="text-3xl font-bold">+1 (555) 911-0000</p>
                </div>

                <div className="card">
                  <h3 className="font-semibold mb-4">Our Support Team</h3>
                  <div className="flex -space-x-3 mb-4">
                    <img src={human1} alt="Support" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                    <img src={human3} alt="Support" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                    <img src={human4} alt="Support" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                  </div>
                  <p className="text-sm text-gray-600">Our dedicated team is ready to assist you with any inquiries.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
