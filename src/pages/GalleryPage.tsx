import { motion } from 'framer-motion'
import PhotoCarousel from '../components/PhotoCarousel'
import useBirthdayStore from '../store/useBirthdayStore'

export default function GalleryPage() {
  const { photos, audioFile } = useBirthdayStore()

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20festive%20birthday%20celebration%20background%2C%20colorful%20confetti%20falling%2C%20golden%20sparkles%2C%20vibrant%20balloons%20in%20pink%20purple%20and%20gold%2C%20party%20streamers%2C%20celebration%20lights%2C%20joyful%20and%20festive%20atmosphere%2C%20realistic%20photography%20style&image_size=landscape_16_9")`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-pink-900/30 to-purple-900/50" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4"
      >
        <PhotoCarousel
          photos={photos.length > 0 ? photos : [
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20birthday%20cake%20with%20colorful%20candles%20glowing%2C%20pink%20frosting%2C%20celebration%20atmosphere%2C%20realistic%20photography&image_size=landscape_16_9',
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Colorful%20birthday%20balloons%20floating%20against%20a%20soft%20pink%20background%2C%20festive%20celebration%20mood%2C%20realistic%20photography&image_size=landscape_16_9',
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20gift%20box%20with%20pink%20ribbon%20on%20a%20sparkly%20background%2C%20birthday%20present%2C%20realistic%20photography&image_size=landscape_16_9'
          ]}
          audioFile={audioFile}
        />
      </motion.div>
    </div>
  )
}
