import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function rootImagesPlugin(): Plugin {
  return {
    name: 'root-gallery-images',
    buildStart() {
      const rootFiles = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '1.png', '2.png', '3.png', '4.png'];
      for (const file of rootFiles) {
        const fullPath = path.resolve(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath);
          this.emitFile({
            type: 'asset',
            fileName: file,
            source: content,
          });
        }
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && /^\/([1-4]\.(jpg|jpeg|png|webp))$/i.test(req.url)) {
          const fileName = req.url.slice(1);
          const fullPath = path.resolve(process.cwd(), fileName);
          if (fs.existsSync(fullPath)) {
            res.setHeader('Content-Type', 'image/jpeg');
            return fs.createReadStream(fullPath).pipe(res);
          }
        }
        next();
      });
    },
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        const rootFiles = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '1.png', '2.png', '3.png', '4.png'];
        for (const file of rootFiles) {
          const rootPath = path.resolve(process.cwd(), file);
          if (fs.existsSync(rootPath)) {
            fs.copyFileSync(rootPath, path.join(distDir, file));
          }
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), rootImagesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
