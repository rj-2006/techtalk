import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion'
import { forwardRef } from 'react'

type MotionProps = HTMLMotionProps<'div'>

interface FadeInProps extends MotionProps {
  delay?: number
  duration?: number
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ delay = 0, duration = 0.3, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
)
FadeIn.displayName = 'FadeIn'

export const SlideIn = forwardRef<HTMLDivElement, FadeInProps & { direction?: 'left' | 'right' | 'up' | 'down' }>(
  ({ delay = 0, duration = 0.3, direction = 'up', children, ...props }, ref) => {
    const directions = {
      up: { y: 20, x: 0 },
      down: { y: -20, x: 0 },
      left: { x: 20, y: 0 },
      right: { x: -20, y: 0 },
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, ...directions[direction] }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay, duration, ease: 'easeOut' }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
SlideIn.displayName = 'SlideIn'

export const ScaleIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ delay = 0, duration = 0.2, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
)
ScaleIn.displayName = 'ScaleIn'

export const MotionConfig = {
  FadeIn,
  SlideIn,
  ScaleIn,
  AnimatePresence,
}

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeOut' },
}

export const listItemTransition = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
}
