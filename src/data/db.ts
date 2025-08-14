/*
  MongoDB bağlantı yardımcıları (Mongoose).
  - .env dosyasını yükler
  - Tekil bağlantı kurar ve tekrar bağlanmayı önler
  - Bağlantı parametrelerini güvenli varsayılanlarla yapılandırır
*/
// Ortam değişkenlerini yüklemek için dotenv kütüphanesini içe aktar.
import 'dotenv/config';
// MongoDB ODM kütüphanesini içe aktar.
import mongoose from 'mongoose';

/**
 * MongoDB'ye Mongoose üzerinden bağlanır.
 * Bağlantı URI önceliği: parametre > process.env.MONGO_URI > lokal fallback.
 * Zaten bağlı ise (readyState === 1) yeniden bağlanmayı atlar.
 *
 * @param mongoUri Opsiyonel bağlantı URI'si (genelde .env'den okunur)
 * @throws Bağlantı kurulamazsa hatayı çağırana fırlatır
 */
// Veritabanına bağlanma fonksiyonu tanımı.
export async function connectToDatabase(mongoUri?: string): Promise<void> {
  try {
    // Bağlantı URI'sini belirle: parametre > ortam değişkeni > varsayılan.
    const uri = mongoUri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_api';
    
    // Güvenlik için log'da kullanıcı adı ve parolayı maskele.
    console.log('MongoDB URI:', uri.replace(/\/\/.*@/, '//***:***@'));
    
    // URI tanımlı değilse hata fırlat.
    if (!uri) {
      throw new Error('MONGO_URI tanımlı değil');
    }
    
    // Bağlantı durumunu kontrol et: 1=bağlı, 2=bağlanıyor, 0=bağlı değil, 3=bağlantıyı kesiyor.
    if (mongoose.connection.readyState === 1) {
      // Zaten bağlıysa bilgi mesajı yazdır ve çık.
      console.log('Zaten MongoDB\'ye bağlı');
      return;
    }
    
    // Bağlantı başlatılıyor mesajı yazdır.
    console.log('MongoDB\'ye bağlanılıyor...');
    
    // MongoDB'ye bağlan ve bağlantı parametrelerini ayarla.
    await mongoose.connect(uri, {
      // Maksimum bağlantı havuzu boyutu.
      maxPoolSize: 10,
      // Sunucu seçim zaman aşımı (milisaniye).
      serverSelectionTimeoutMS: 5000,
      // Soket zaman aşımı (milisaniye).
      socketTimeoutMS: 45000,
    });
    
    // Başarılı bağlantı mesajı yazdır.
    console.log('MongoDB\'ye başarıyla bağlandı!');
    // Bağlantı durumunu yazdır.
    console.log('Bağlantı durumu:', mongoose.connection.readyState);
    
  } catch (error) {
    // Hata durumunda detaylı hata mesajı yazdır.
    console.error('MongoDB bağlantı hatası detayı:', error);
    // Hatayı çağırana fırlat.
    throw error;
  }
} 