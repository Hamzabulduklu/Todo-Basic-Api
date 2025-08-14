// Mongoose kütüphanesini ve gerekli türleri içe aktar.
import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

/*
  Kullanıcı modeli
  - email: benzersiz, zorunlu
  - passwordHash: bcrypt ile hashlenmiş parola
  - createdAt: otomatik
*/
// Kullanıcı şeması tanımı.
const UserSchema = new Schema(
  {
    // E‑mail alanı: zorunlu, benzersiz, küçük harf, boşluk temizleme, indeksleme.
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    // Hash'lenmiş parola alanı: zorunlu.
    passwordHash: { type: String, required: true },
    // Oluşturulma tarihi: otomatik olarak şu anki zaman.
    createdAt: { type: Date, default: Date.now },
  },
  // Versiyon anahtarını devre dışı bırak.
  { versionKey: false }
);

// Şemadan türetilen kullanıcı döküman türü.
export type UserDoc = InferSchemaType<typeof UserSchema>;

// Kullanıcı modeli: var olan modeli kullan veya yeni oluştur.
export const UserModel: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>('User', UserSchema); 