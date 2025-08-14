/*
  Todo modeli (Mongoose şeması ve model tanımı).
  - Uygulama seviyesinde benzersiz sayısal `id`
  - Durum alanı: 'new' | 'blocked' | 'done'
  - createdAt otomatik olarak atanır
*/
// Mongoose kütüphanesini ve gerekli türleri içe aktar.
import mongoose, { Schema, InferSchemaType, Model, Types } from 'mongoose';

// İş kurallarına uygun alan ve kısıtları tanımlayan şema
// Todo şeması tanımı.
const TodoSchema = new Schema(
  {
    // Benzersiz sayısal kimlik alanı: zorunlu, benzersiz, indeksli.
    id: { type: Number, required: true, unique: true, index: true },
    // Kullanıcı referansı: ObjectId türü, User modeline referans, zorunlu, indeksli.
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // Todo başlığı: zorunlu, boşluk temizleme.
    title: { type: String, required: true, trim: true },
    // Todo durumu: sadece belirtilen değerlerden biri, varsayılan 'new'.
    status: { type: String, enum: ['new', 'blocked', 'done'], default: 'new' },
    // Oluşturulma tarihi: otomatik olarak şu anki zaman.
    createdAt: { type: Date, default: Date.now },
  },
  // Versiyon anahtarını devre dışı bırak.
  { versionKey: false }
);

// Kullanıcı kimliği ve oluşturulma tarihine göre bileşik indeks oluştur.
TodoSchema.index({ userId: 1, createdAt: -1 });

// Şemadan türetilen todo döküman türü.
export type TodoDoc = InferSchemaType<typeof TodoSchema>;

// Todo modeli: var olan modeli kullan veya yeni oluştur (hot-reload uyumlu).
export const TodoModel: Model<TodoDoc> =
  mongoose.models.Todo || mongoose.model<TodoDoc>('Todo', TodoSchema); 