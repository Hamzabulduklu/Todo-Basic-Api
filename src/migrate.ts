/*
  todos.json içeriğini MongoDB'ye taşıyan script.
  - JSON dosyasını okur
  - Mevcut veriyi temizler
  - Kayıtları uygun tiplere dönüştürüp Mongo'ya yazar
*/
// Veritabanı bağlantı fonksiyonunu içe aktar.
import { connectToDatabase } from './data/db.js';
// Todo modelini içe aktar.
import { TodoModel } from './models/Todo.js';
// Dosya sistemi işlemleri için fs modülünü içe aktar.
import fs from 'fs';
// Dosya yolu işlemleri için path modülünü içe aktar.
import path from 'path';
// URL'den dosya yolu oluşturmak için fileURLToPath fonksiyonunu içe aktar.
import { fileURLToPath } from 'url';

// Mevcut dosyanın tam yolunu al.
const __filename = fileURLToPath(import.meta.url);
// Mevcut dosyanın dizin yolunu al.
const __dirname = path.dirname(__filename);

// JSON dosyasındaki todo veri yapısını tanımla.
interface TodoData {
  // Todo'nun benzersiz kimliği.
  id: number;
  // Todo'nun başlığı.
  title: string;
  // Todo'nun durumu.
  status: 'new' | 'blocked' | 'done';
  // Todo'nun oluşturulma tarihi (string formatında).
  createdAt: string;
}

/**
 * JSON dosyasındaki verileri MongoDB'ye migrasyon eder.
 * Başarılı olursa toplam kayıt sayısını loglar ve süreçten çıkar.
 */
// JSON verilerini MongoDB'ye aktaran asenkron fonksiyon.
async function migrateData() {
  try {
    // MongoDB veritabanına bağlan.
    await connectToDatabase();
    // Bağlantı başarılı mesajı yazdır.
    console.log('MongoDB\'ye bağlandı');

    // JSON dosyasının yolunu oluştur.
    const jsonPath = path.join(__dirname, '../todos.json');
    // JSON dosyasını UTF-8 kodlaması ile oku.
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    // JSON verisini parse et ve TodoData dizisine dönüştür.
    const todos: TodoData[] = JSON.parse(jsonData);

    // Mevcut tüm todo verilerini sil.
    await TodoModel.deleteMany({});
    // Silme işlemi tamamlandı mesajı yazdır.
    console.log('Mevcut MongoDB verileri temizlendi');

    // JSON verilerini MongoDB formatına dönüştür.
    const migratedTodos = todos.map(todo => ({
      // Todo kimliğini kullan.
      id: todo.id,
      // Todo başlığını kullan.
      title: todo.title,
      // Todo durumunu kullan.
      status: todo.status,
      // String tarihi Date nesnesine dönüştür.
      createdAt: new Date(todo.createdAt)
    }));

    // Dönüştürülmüş verileri MongoDB'ye toplu olarak ekle.
    await TodoModel.insertMany(migratedTodos);
    // Aktarılan veri sayısını yazdır.
    console.log(`${migratedTodos.length} todo başarıyla MongoDB'ye aktarıldı`);

    // Aktarılan veri sayısını doğrula.
    const count = await TodoModel.countDocuments();
    // Toplam veri sayısını yazdır.
    console.log(`MongoDB'de toplam ${count} todo var`);

    // Başarılı sonlandırma kodu ile çık.
    process.exit(0);
  } catch (error) {
    // Hata durumunda hata mesajını yazdır.
    console.error('Migration hatası:', error);
    // Hata kodu ile çık.
    process.exit(1);
  }
}

// Veri aktarım işlemini başlat.
migrateData(); 