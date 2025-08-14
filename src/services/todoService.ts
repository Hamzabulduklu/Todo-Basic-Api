// Todo modeli ve türlerini içe aktar.
import { TodoModel, TodoDoc } from '../models/Todo.js';

/**
 * HTTP katmanına döndürülen Todo tipi (ISO tarih string'i ile)
 */
// HTTP yanıtlarında kullanılacak Todo arayüzü tanımı.
export interface Todo {
  // Todo'nun benzersiz kimliği.
  id: number;
  // Todo'nun başlığı.
  title: string;
  // Todo'nun durumu (yeni, engellenmiş, tamamlanmış).
  status: 'new' | 'blocked' | 'done';
  // Todo'nun oluşturulma tarihi (ISO string formatında).
  createdAt: string;
}

/**
 * Todo'ları listele (opsiyonel durum filtresi ve sayfalama ile).
 * Sadece talepteki kullanıcıya ait kayıtları döner.
 */
// Todo listesi getirme fonksiyonu tanımı.
export async function listTodos(userId: string, page = 1, limit = 5, status?: 'new' | 'blocked' | 'done'): Promise<Todo[]> {
  // Filtre nesnesini oluştur ve kullanıcı kimliğini ekle.
  const filter: Record<string, unknown> = { userId };
  // Durum filtresi varsa filtreye ekle.
  if (status) filter.status = status;

  // Veritabanından todo'ları getir.
  const docs = await TodoModel.find(filter)
    // Oluşturulma tarihine göre azalan sırala (en yeni önce).
    .sort({ createdAt: -1 })
    // Sayfalama için atlanacak kayıt sayısını hesapla.
    .skip((page - 1) * limit)
    // Sayfa başına kayıt sayısını sınırla.
    .limit(limit)
    // Yalın nesne olarak döndür (performans için).
    .lean();

  // Veritabanı dökümanlarını HTTP yanıt formatına dönüştür.
  return docs.map(doc => ({
    // Döküman kimliğini kullan.
    id: doc.id,
    // Başlığı kullan.
    title: doc.title,
    // Durumu kullan.
    status: doc.status as Todo['status'],
    // Tarihi ISO string formatına çevir.
    createdAt: new Date(doc.createdAt!).toISOString(),
  }));
}

/** Yeni bir Todo ekle (kullanıcıya bağlı). */
// Yeni todo ekleme fonksiyonu tanımı.
export async function addTodo(userId: string, title: string, status: 'new' | 'blocked' | 'done' = 'new'): Promise<Todo> {
  // Başlık boş veya sadece boşluk karakterlerinden oluşuyorsa hata fırlat.
  if (!title || title.trim().length === 0) {
    throw new Error('Todo başlığı boş olamaz');
  }
  // Yeni todo dökümanını oluştur.
  const todo: TodoDoc = await TodoModel.create({
    // Benzersiz kimlik olarak şu anki zaman damgasını kullan.
    id: Date.now(),
    // Kullanıcı kimliğini ekle.
    userId,
    // Başlığı temizle (başındaki ve sonundaki boşlukları kaldır).
    title: title.trim(),
    // Durumu ekle (varsayılan: 'new').
    status,
  });
  // Oluşturulan todo'yu HTTP yanıt formatında döndür.
  return {
    // Todo kimliğini kullan.
    id: todo.id,
    // Başlığı kullan.
    title: todo.title,
    // Durumu kullan.
    status: todo.status as Todo['status'],
    // Tarihi ISO string formatına çevir.
    createdAt: new Date(todo.createdAt!).toISOString(),
  };
}

/** Var olan bir Todo'yu güncelle (sahiplik kontrolü). */
// Todo güncelleme fonksiyonu tanımı.
export async function updateTodo(
  userId: string,
  id: number,
  updates: { title?: string; status?: 'new' | 'blocked' | 'done' }
): Promise<Todo | null> {
  // Güncellenecek başlık varsa ve boşsa hata fırlat.
  if (updates.title !== undefined && updates.title.trim().length === 0) {
    throw new Error('Todo başlığı boş olamaz');
  }

  // Todo'yu güncelle (sadece kullanıcıya ait olanı).
  const updated = await TodoModel.findOneAndUpdate(
    // Filtre: belirtilen kimlik ve kullanıcıya ait.
    { id, userId },
    // Güncelleme: belirtilen alanları güncelle.
    { $set: updates },
    // Yeni dökümanı döndür.
    { new: true }
  ).lean();

  // Todo bulunamadıysa null döndür.
  if (!updated) return null;
  // Güncellenmiş todo'yu HTTP yanıt formatında döndür.
  return {
    // Todo kimliğini kullan.
    id: updated.id,
    // Başlığı kullan.
    title: updated.title,
    // Durumu kullan.
    status: updated.status as Todo['status'],
    // Tarihi ISO string formatına çevir.
    createdAt: new Date(updated.createdAt!).toISOString(),
  };
}

/** Todo sil (sahiplik kontrolü). */
// Todo silme fonksiyonu tanımı.
export async function deleteTodo(userId: string, id: number): Promise<boolean> {
  // Belirtilen kullanıcıya ait todo'yu sil.
  const res = await TodoModel.deleteOne({ id, userId });
  // Silinen kayıt sayısı 1 ise başarılı, değilse başarısız.
  return res.deletedCount === 1;
}
