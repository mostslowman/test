import { useState, useRef, ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Music, Image, FileText, Eye } from 'lucide-react'
import useBirthdayStore from '../store/useBirthdayStore'

interface ConfigPageProps {
  onPreview: () => void
}

export default function ConfigPage({ onPreview }: ConfigPageProps) {
  const {
    letterContent,
    photos,
    audioFile,
    audioName,
    setLetterContent,
    addPhoto,
    removePhoto,
    setAudio
  } = useBirthdayStore()

  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLetterContent(e.target.value)
  }

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (photos.length >= 8) return

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          addPhoto(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAudioUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setAudio(event.target.result as string, file.name)
      }
    }
    reader.readAsDataURL(file)

    if (audioInputRef.current) {
      audioInputRef.current.value = ''
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    Array.from(files).forEach((file) => {
      if (photos.length >= 8) return
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          addPhoto(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const canPreview = letterContent.trim().length > 0 || photos.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            🎂 生日祝福生成器
          </h1>
          <p className="text-gray-600 text-lg">
            创建一份特别的生日祝福，给TA一个惊喜
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-pink-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">祝福文字</h2>
          </div>

          <textarea
            value={letterContent}
            onChange={handleTextChange}
            placeholder="在这里写下你的祝福语...&#10;&#10;例如：&#10;亲爱的朋友，&#10;祝你生日快乐！&#10;愿你的每一天都充满阳光和欢笑，&#10;愿你的梦想都能实现！"
            className="w-full h-48 p-4 border-2 border-pink-100 rounded-2xl resize-none focus:outline-none focus:border-pink-300 transition-colors text-gray-700 placeholder:text-gray-400"
            style={{
              fontFamily: '"Ma Shan Zheng", "ZCOOL XiaoWei", cursive',
              fontSize: '1.1rem',
              lineHeight: '1.8'
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Image className="w-5 h-5 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                照片上传
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({photos.length}/8)
                </span>
              </h2>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-purple-400 bg-purple-50'
                : 'border-purple-200 hover:border-purple-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-purple-300 mb-4" />
              <p className="text-gray-600 mb-2">拖拽照片到这里或点击上传</p>
              <p className="text-sm text-gray-400">支持 JPG, PNG, GIF 格式</p>
            </label>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {photos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Music className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">背景音乐</h2>
          </div>

          <div className="border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center hover:border-blue-300 transition-colors">
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Music className="w-10 h-10 text-blue-300 mb-3" />
              <p className="text-gray-600">
                {audioName || '点击上传背景音乐'}
              </p>
              <p className="text-sm text-gray-400 mt-1">支持 MP3, WAV, OGG 格式</p>
            </label>
          </div>

          {audioFile && (
            <div className="mt-4 flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{audioName}</span>
              </div>
              <button
                onClick={() => setAudio('', '')}
                className="text-red-500 hover:text-red-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            onClick={onPreview}
            disabled={!canPreview}
            className={`px-12 py-4 rounded-full text-lg font-medium flex items-center gap-3 mx-auto cursor-pointer transition-all ${
              canPreview
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={canPreview ? { scale: 1.05 } : {}}
            whileTap={canPreview ? { scale: 0.95 } : {}}
          >
            <Eye className="w-5 h-5" />
            预览祝福
          </motion.button>

          {!canPreview && (
            <p className="text-sm text-gray-500 mt-3">
              请至少输入祝福文字或上传照片
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
