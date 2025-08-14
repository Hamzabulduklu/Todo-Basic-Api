/*
  Uygulama girişi (Express sunucusu).
  - JSON body parsing middleware kurulur
  - /health, /auth ve /todos rotaları tanımlanır
  - MongoDB bağlantısı kurulduktan sonra HTTP sunucusu ayağa kaldırılır
*/
// Ortam değişkenlerini yüklemek için dotenv kütüphanesini içe aktar.
import 'dotenv/config';
// Todo işlemlerini yöneten controller'ı içe aktar.
import app from './app.js';
// MongoDB veritabanı bağlantı fonksiyonunu içe aktar.
import { connectToDatabase } from './data/db.js';

// Sunucu portunu belirle: ortam değişkeni varsa onu kullan, yoksa 3000.
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Uygulama başlatma: önce DB'ye bağlan, sonra server'ı dinlemeye al
/**
 * Uygulama bootstrap akışı.
 * - MongoDB'ye bağlanır (URI .env/ortam değişkeninden okunur)
 * - Bağlantı başarılı olursa Express sunucusunu belirtilen portta dinlemeye alır
 */
// Uygulamayı başlatan asenkron fonksiyon tanımı.
async function bootstrap() {
  try {
    // MongoDB veritabanına bağlan.
    await connectToDatabase();
    // HTTP sunucusunu belirtilen portta dinlemeye başlat.
    app.listen(PORT, () => {
      // Sunucu başlatıldığında konsola bilgi yazdır.
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    // Veritabanı bağlantı hatası durumunda hata mesajı yazdır.
    console.error('Veritabanına bağlanılamadı:', error);
    // Uygulamayı hata kodu ile sonlandır.
    process.exit(1);
  }
}

// Uygulamayı başlat.
bootstrap();
