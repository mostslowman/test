import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Envelope from '../components/Envelope'

export default function EnvelopePage() {
  const navigate = useNavigate()

  const handleOpen = () => {
    navigate('/letter')
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20warm%20and%20romantic%20birthday%20celebration%20background%2C%20soft%20pink%20and%20golden%20bokeh%20lights%2C%20floating%20colorful%20balloons%2C%20confetti%20scattered%20around%2C%20gentle%20gradient%20from%20soft%20pink%20to%20warm%20peach%2C%20dreamy%20atmosphere%2C%20celebration%20mood%2C%20realistic%20photography%20style&image_size=landscape_16_9")`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/30 via-purple-900/20 to-pink-900/40" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <Envelope onOpen={handleOpen} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm"
      >
        为你准备的特别祝福
      </motion.div>
    </div>
  )
}
