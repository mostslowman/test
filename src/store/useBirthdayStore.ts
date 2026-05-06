import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BirthdayState {
  letterContent: string
  photos: string[]
  audioFile: string | null
  audioName: string
  setLetterContent: (content: string) => void
  addPhoto: (photo: string) => void
  removePhoto: (index: number) => void
  setAudio: (audio: string, name: string) => void
  resetAll: () => void
}

const useBirthdayStore = create<BirthdayState>()(
  persist(
    (set) => ({
      letterContent: '',
      photos: [],
      audioFile: null,
      audioName: '',
      setLetterContent: (content) => set({ letterContent: content }),
      addPhoto: (photo) => set((state) => {
        if (state.photos.length >= 8) return state
        return { photos: [...state.photos, photo] }
      }),
      removePhoto: (index) => set((state) => ({
        photos: state.photos.filter((_, i) => i !== index)
      })),
      setAudio: (audio, name) => set({ audioFile: audio, audioName: name }),
      resetAll: () => set({
        letterContent: '',
        photos: [],
        audioFile: null,
        audioName: ''
      })
    }),
    {
      name: 'birthday-wishes-storage'
    }
  )
)

export default useBirthdayStore
