import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve the MEDIA folder as static assets (video, images) at the site root.
  // e.g. MEDIA/VIDEOS/foo.mp4  ->  /VIDEOS/foo.mp4
  publicDir: 'MEDIA',
})
