import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface EnvelopeProps {
  onOpen: () => void
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
        className="relative"
      >
        <svg
          viewBox="0 0 400 280"
          className="w-full drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))' }}
        >
          <defs>
            <linearGradient id="envelopeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fce4ec" />
              <stop offset="50%" stopColor="#f8bbd9" />
              <stop offset="100%" stopColor="#f48fb1" />
            </linearGradient>
            <linearGradient id="flapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8bbd9" />
              <stop offset="100%" stopColor="#f48fb1" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.2" />
            </filter>
          </defs>

          <rect
            x="20"
            y="60"
            width="360"
            height="200"
            rx="8"
            fill="url(#envelopeGradient)"
            filter="url(#shadow)"
          />

          <path
            d="M20 60 L200 180 L380 60"
            fill="none"
            stroke="#ec407a"
            strokeWidth="2"
            opacity="0.3"
          />

          <path
            d="M20 260 L200 140 L380 260"
            fill="url(#flapGradient)"
            filter="url(#shadow)"
          />

          <path
            d="M20 260 L200 140 L380 260"
            fill="none"
            stroke="#e91e63"
            strokeWidth="1"
            opacity="0.5"
          />

          <ellipse
            cx="200"
            cy="160"
            rx="25"
            ry="20"
            fill="#fff"
            opacity="0.6"
          />

          <circle cx="80" cy="100" r="8" fill="#fff" opacity="0.4" />
          <circle cx="320" cy="100" r="6" fill="#fff" opacity="0.4" />
          <circle cx="60" cy="200" r="5" fill="#fff" opacity="0.3" />
          <circle cx="340" cy="200" r="7" fill="#fff" opacity="0.3" />

          <path
            d="M50 80 Q60 70 70 80 Q80 90 90 80"
            stroke="#e91e63"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M310 90 Q320 80 330 90 Q340 100 350 90"
            stroke="#e91e63"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
        </svg>

        <motion.button
          onClick={onOpen}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="relative">
            <Heart
              className="w-16 h-16 text-red-500 drop-shadow-lg"
              fill="#ef4444"
              strokeWidth={2}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-red-400 opacity-30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-8 text-white text-lg font-medium"
        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
      >
        点击心形打开祝福
      </motion.p>
    </div>
  )
}
