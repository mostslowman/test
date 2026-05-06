import { motion } from 'framer-motion'

interface LetterPaperProps {
  content: string
  onComplete: () => void
}

export default function LetterPaper({ content, onComplete }: LetterPaperProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <svg
          viewBox="0 0 600 700"
          className="w-full drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))' }}
        >
          <defs>
            <linearGradient id="paperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff9f0" />
              <stop offset="50%" stopColor="#fff5eb" />
              <stop offset="100%" stopColor="#ffefdb" />
            </linearGradient>
            <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.15" />
            </filter>
            <pattern id="linedPaper" patternUnits="userSpaceOnUse" width="600" height="30">
              <line x1="0" y1="30" x2="600" y2="30" stroke="#e0d5c5" strokeWidth="1" />
            </pattern>
          </defs>

          <rect
            x="30"
            y="30"
            width="540"
            height="640"
            rx="4"
            fill="url(#paperGradient)"
            filter="url(#paperShadow)"
          />

          <rect
            x="30"
            y="30"
            width="540"
            height="640"
            fill="url(#linedPaper)"
            opacity="0.5"
          />

          <path
            d="M30 30 L570 30 L570 670 L30 670 Z"
            fill="none"
            stroke="#d4a574"
            strokeWidth="3"
            rx="4"
          />

          <path
            d="M40 40 L560 40 L560 660 L40 660 Z"
            fill="none"
            stroke="#e8d5b7"
            strokeWidth="1"
            strokeDasharray="5,5"
          />

          <circle cx="60" cy="60" r="15" fill="#f8bbd9" opacity="0.3" />
          <circle cx="540" cy="60" r="15" fill="#f8bbd9" opacity="0.3" />
          <circle cx="60" cy="640" r="15" fill="#f8bbd9" opacity="0.3" />
          <circle cx="540" cy="640" r="15" fill="#f8bbd9" opacity="0.3" />

          <path
            d="M50 50 Q55 45 60 50 Q65 55 70 50"
            stroke="#f48fb1"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M530 50 Q535 45 540 50 Q545 55 550 50"
            stroke="#f48fb1"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <span className="text-4xl">🎂</span>
          </motion.div>

          <div className="w-full h-80 overflow-y-auto px-8">
            <p
              className="text-xl leading-relaxed text-gray-700 whitespace-pre-wrap break-words"
              style={{
                fontFamily: '"Ma Shan Zheng", "ZCOOL XiaoWei", cursive',
                lineHeight: '2.2'
              }}
            >
              {content}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-6 bg-pink-500 ml-1"
              />
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8"
          >
            <span className="text-3xl">🎈</span>
            <span className="text-3xl mx-4">🎁</span>
            <span className="text-3xl">🎈</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.button
        onClick={onComplete}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 px-8 py-3 bg-transparent border-2 border-white text-white rounded-full text-lg font-medium cursor-pointer transition-all duration-300 hover:bg-white/10"
        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
      >
        下一页
      </motion.button>
    </div>
  )
}
