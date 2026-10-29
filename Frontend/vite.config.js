import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendRoot = fileURLToPath(new URL('.', import.meta.url))
const sceneAssetsDirectory = join(frontendRoot, 'public', 'images', 'scenes')
const videoAssetsDirectory = join(frontendRoot, 'public', 'videos')

function sceneAssetManifest() {
  const listSceneAssets = () => readdirSync(sceneAssetsDirectory)
    .filter((name) => /\.(avif|gif|jpe?g|png|webp)$/i.test(name))
    .sort()

  return {
    name: 'scene-asset-manifest',
    configureServer(server) {
      server.middlewares.use('/images/scenes/manifest.json', (_request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify(listSceneAssets()))
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'images/scenes/manifest.json',
        source: JSON.stringify(listSceneAssets()),
      })
    },
  }
}

function momentVideoManifest() {
  const listMomentVideos = () => readdirSync(videoAssetsDirectory)
    .filter((name) => /^(scan|browse|find|manage|reach|update)(-mobile)?\.mp4$/i.test(name))
    .sort()

  return {
    name: 'moment-video-manifest',
    configureServer(server) {
      server.middlewares.use('/videos/manifest.json', (_request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify(listMomentVideos()))
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'videos/manifest.json',
        source: JSON.stringify(listMomentVideos()),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sceneAssetManifest(), momentVideoManifest()],
})
