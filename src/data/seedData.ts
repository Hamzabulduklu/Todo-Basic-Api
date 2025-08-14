/*
  Geliştirme/test için örnek verileri MongoDB'ye yükleme script'i.
  - Mevcut veriyi temizler
  - Örnek todo kayıtlarını ekler
  - Toplam sayıyı loglar
*/
// Veritabanı bağlantı fonksiyonunu içe aktar.
import { connectToDatabase } from './db.js';
// Todo modelini içe aktar.
import { TodoModel } from '../models/Todo.js';

// Örnek todo verilerini tanımla.
const seedTodos = [
  {
    // İlk todo: alışveriş yapma görevi.
    id: 1,
    title: "Alışveriş yap",
    status: "new" as const,
    createdAt: new Date("2025-08-10T08:00:00.000Z")
  },
  {
    // İkinci todo: TypeScript öğrenme görevi (engellenmiş).
    id: 2,
    title: "TypeScript öğren",
    status: "blocked" as const,
    createdAt: new Date("2025-08-09T10:30:00.000Z")
  },
  {
    // Üçüncü todo: Express API yazma görevi (tamamlanmış).
    id: 3,
    title: "Express ile API yaz",
    status: "done" as const,
    createdAt: new Date("2025-08-08T14:15:00.000Z")
  },
  {
    // Dördüncü todo: README güncelleme görevi.
    id: 4,
    title: "README güncelle",
    status: "new" as const,
    createdAt: new Date("2025-08-08T18:42:00.000Z")
  },
  {
    // Beşinci todo: kod refactor etme görevi (engellenmiş).
    id: 5,
    title: "Kodları refactor et",
    status: "blocked" as const,
    createdAt: new Date("2025-08-07T09:05:00.000Z")
  },
  {
    // Altıncı todo: test yazma görevi.
    id: 6,
    title: "Testler yaz",
    status: "new" as const,
    createdAt: new Date("2025-08-07T12:20:00.000Z")
  },
  {
    // Yedinci todo: CI/CD kurma görevi (tamamlanmış).
    id: 7,
    title: "CI/CD kur",
    status: "done" as const,
    createdAt: new Date("2025-08-06T16:50:00.000Z")
  },
  {
    // Sekizinci todo: dokümantasyon hazırlama görevi.
    id: 8,
    title: "Dokümantasyon hazırla",
    status: "new" as const,
    createdAt: new Date("2025-08-05T07:45:00.000Z")
  },
  {
    // Dokuzuncu todo: UI geliştirme görevi (engellenmiş).
    id: 9,
    title: "UI geliştirmeleri",
    status: "blocked" as const,
    createdAt: new Date("2025-08-04T11:10:00.000Z")
  },
  {
    // Onuncu todo: performans optimizasyonu görevi (tamamlanmış).
    id: 10,
    title: "Performans optimizasyonu",
    status: "done" as const,
    createdAt: new Date("2025-08-03T20:30:00.000Z")
  }
];

/**
 * Örnek verileri MongoDB'ye yükler.
 * Başarılıysa süreç kodu 0 ile sonlandırılır, hata halinde 1 ile.
 */
// Veritabanını örnek verilerle dolduran asenkron fonksiyon.
async function seedDatabase() {
  try {
    // MongoDB veritabanına bağlan.
    await connectToDatabase();
    // Bağlantı başarılı mesajı yazdır.
    console.log('MongoDB\'ye bağlandı');

    // Mevcut tüm todo verilerini sil.
    await TodoModel.deleteMany({});
    // Silme işlemi tamamlandı mesajı yazdır.
    console.log('Mevcut MongoDB verileri temizlendi');

    // Örnek todo verilerini toplu olarak ekle.
    await TodoModel.insertMany(seedTodos);
    // Eklenen veri sayısını yazdır.
    console.log(`${seedTodos.length} todo başarıyla MongoDB'ye eklendi`);

    // Eklenen veri sayısını doğrula.
    const count = await TodoModel.countDocuments();
    // Toplam veri sayısını yazdır.
    console.log(`MongoDB'de toplam ${count} todo var`);

    // Başarılı sonlandırma kodu ile çık.
    process.exit(0);
  } catch (error) {
    // Hata durumunda hata mesajını yazdır.
    console.error('Seed hatası:', error);
    // Hata kodu ile çık.
    process.exit(1);
  }
}

// Veritabanı doldurma işlemini başlat.
seedDatabase(); 