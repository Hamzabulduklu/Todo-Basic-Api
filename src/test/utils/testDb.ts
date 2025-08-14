// Testler için bellek içi MongoDB sunucusunu sağlayan yardımcı fonksiyonlar.
import { MongoMemoryServer } from 'mongodb-memory-server';
// Mongoose bağlantısını yönetmek için import edilir.
import mongoose from 'mongoose';

// Çalışan in-memory MongoDB örneğini tutmak için değişken.
let mongo: MongoMemoryServer | null = null;

// In-memory MongoDB başlat ve bağlantı URI'sini döndür.
export async function startInMemoryMongo(): Promise<string> {
  // Yeni bir in-memory MongoDB örneği oluştur.
  mongo = await MongoMemoryServer.create();
  // Bağlantı URI'sini al.
  const uri = mongo.getUri();
  // Testlerde kullanılmak üzere URI'yi döndür.
  return uri;
}

// In-memory MongoDB'yi ve varsa açık Mongoose bağlantısını kapat.
export async function stopInMemoryMongo(): Promise<void> {
  // Eğer Mongoose bağlantısı açık/bağlanıyor ise bağlantıyı kes.
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  // MongoMemoryServer çalışıyorsa durdur ve referansı temizle.
  if (mongo) {
    await mongo.stop();
    mongo = null;
  }
}


