import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

interface PhotoCarouselProps {
  photos: string[]
  audioFile: string | null
}

export default function PhotoCarousel({ photos, audioFile }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (photos.length === 0) return

    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentIndex((prev) => (prev + 1) % photos.length)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [photos.length, isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioFile) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => {
      audio.currentTime = 0
      audio.play()
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    audio.play().catch(() => {})

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioFile])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audio.currentTime = percent * duration
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-xl">没有照片可展示</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {audioFile && (
        <audio ref={audioRef} src={audioFile} preload="metadata" />
      )}

      <div className="relative w-full max-w-4xl aspect-video mb-8">
        <div className="relative w-full h-full perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={photos[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                style={{
                  maxHeight: '60vh',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SkipBack className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SkipForward className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex gap-2 mb-8">
        {photos.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>

      {audioFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md px-4"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <div className="flex items-center gap-4 mb-3">
              <motion.button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </motion.button>

              <div className="flex-1">
                <div
                  className="h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden"
                  onClick={handleSeek}
                >
                  <motion.div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between text-white/80 text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center"
      >
        <p className="text-white text-2xl font-medium" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          🎉 生日快乐！🎉
        </p>
      </motion.div>
    </div>
  )
}
