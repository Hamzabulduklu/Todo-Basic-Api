// Vitest yapılandırması için yardımcı fonksiyonu içe aktar.
import { defineConfig } from 'vitest/config';

// Vitest'i Node ortamında, src altındaki *.spec.ts dosyalarını çalıştıracak şekilde yapılandır.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});


