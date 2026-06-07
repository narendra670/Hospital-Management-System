import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={`bg-white rounded-xl shadow-md ${hover ? 'hover:shadow-xl' : ''} transition-shadow duration-300 p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
