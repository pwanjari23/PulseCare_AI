// Reusable motion configurations for Framer Motion

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut', ...custom },
  }),
  exit: (custom = {}) => ({
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn', ...custom },
  }),
};

export const slideIn = (direction = 'up') => {
  const offsets = {
    up: { y: 16, x: 0 },
    down: { y: -16, x: 0 },
    left: { x: 16, y: 0 },
    right: { x: -16, y: 0 },
  };

  return {
    hidden: { opacity: 0, ...offsets[direction] },
    visible: (custom = {}) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], ...custom },
    }),
    exit: (custom = {}) => ({
      opacity: 0,
      ...offsets[direction],
      transition: { duration: 0.2, ease: 'easeIn', ...custom },
    }),
  };
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1], ...custom },
  }),
  exit: (custom = {}) => ({
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.15, ease: 'easeIn', ...custom },
  }),
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const drawerVariants = (anchor = 'right') => {
  return {
    hidden: { x: anchor === 'right' ? '100%' : '-100%' },
    visible: {
      x: 0,
      transition: { type: 'spring', damping: 25, stiffness: 220 },
    },
    exit: {
      x: anchor === 'right' ? '100%' : '-100%',
      transition: { duration: 0.25, ease: 'easeInOut' },
    },
  };
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

export const hoverScale = {
  hover: { scale: 1.015, transition: { duration: 0.15, ease: 'easeOut' } },
  tap: { scale: 0.985 },
};
