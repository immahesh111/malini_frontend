import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    assetsInclude: ['**/*.glb'],
    define: {
      'import.meta.env.PUBLIC_URL': JSON.stringify(env.PUBLIC_URL || ''),
    },
  }
})
