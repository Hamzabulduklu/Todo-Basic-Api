/*
  MongoDB bağlantısını hızlıca doğrulamak için basit test script'i.
  - .env'deki MONGO_URI ile bağlanmayı dener
  - Başarı/başarısızlık durumunu loglar
*/
// Veritabanı bağlantı fonksiyonunu içe aktar.
import { connectToDatabase } from '../data/db.js';

/**
 * MongoDB bağlantı testi yapar ve süreçten çıkar.
 */
// MongoDB bağlantısını test eden asenkron fonksiyon.
async function testConnection() {
  try {
    // Bağlantı denemesi başladı mesajı yazdır.
    console.log('MongoDB\'ye bağlanmaya çalışılıyor...');
    // Veritabanına bağlanmayı dene.
    await connectToDatabase();
    // Başarılı bağlantı mesajı yazdır.
    console.log('✅ MongoDB\'ye başarıyla bağlandı!');
    // Başarılı sonlandırma kodu ile çık.
    process.exit(0);
  } catch (error) {
    // Hata durumunda hata mesajını yazdır.
    console.error('❌ MongoDB bağlantı hatası:', error);
    // Hata kodu ile çık.
    process.exit(1);
  }
}

// Bağlantı testini başlat.
testConnection(); 