import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LetterPaper from '../components/LetterPaper'
import { useTypewriter } from '../hooks/useTypewriter'
import useBirthdayStore from '../store/useBirthdayStore'

export default function LetterPage() {
  const navigate = useNavigate()
  const { letterContent } = useBirthdayStore()

  const { displayText, isComplete, reset } = useTypewriter({
    text: letterContent || '祝你生日快乐！愿你的每一天都充满阳光和欢笑！',
    speed: 300
  })

  useEffect(() => {
    reset()
  }, [reset])

  const handleComplete = () => {
    navigate('/gallery')
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20cozy%20and%20warm%20birthday%20background%2C%20vintage%20paper%20texture%2C%20soft%20golden%20light%20rays%2C%20scattered%20rose%20petals%2C%20delicate%20floral%20decorations%2C%20romantic%20and%20heartwarming%20atmosphere%2C%20soft%20focus%20bokeh%20effect%2C%20realistic%20photography%20style&image_size=landscape_16_9")`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-orange-900/20 to-amber-900/40" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-3xl"
      >
        <LetterPaper content={displayText} onComplete={handleComplete} />
      </motion.div>
    </div>
  )
}
