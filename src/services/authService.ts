// Kullanıcı parolalarını hashlemek ve doğrulamak için bcryptjs kütüphanesini içe aktar.
import bcrypt from 'bcryptjs';
// JWT üretmek için jsonwebtoken kütüphanesini içe aktar.
import jwt from 'jsonwebtoken';
// MongoDB kullanıcı modelini içe aktar.
import { UserModel } from '../models/User.js';
// Sabit JWT gizli anahtarını içe aktar.
import { JWT_SECRET } from '../config.js';

// Yeni kullanıcı kaydı yapan asenkron fonksiyon tanımı.
export async function registerUser(email: string, password: string) {
  // Aynı e‑mail ile bir kullanıcı var mı kontrol et (yalın nesne döndür).
  const existing = await UserModel.findOne({ email }).lean();
  // Varsa hata fırlat.
  if (existing) throw new Error('Email already in use');

  // Parolayı güvenli bir şekilde hashle.
  const passwordHash = await bcrypt.hash(password, 10);
  // Yeni kullanıcı dökümanını oluştur.
  const user = await UserModel.create({ email, passwordHash });
  // İstemciye kullanıcı kimliği ve e‑mail bilgisini döndür.
  return { id: user._id.toString(), email: user.email };
}

// Kullanıcı girişi yapan asenkron fonksiyon tanımı.
export async function loginUser(email: string, password: string) {
  // E‑mail ile kullanıcıyı veritabanında bul.
  const user = await UserModel.findOne({ email });
  // Bulunamadıysa kimlik bilgileri geçersiz hatası ver.
  if (!user) throw new Error('Invalid credentials');

  // Dışarıdan gelen parola ile kayıtlı hash'i karşılaştır.
  const ok = await bcrypt.compare(password, user.passwordHash);
  // Eşleşmiyorsa kimlik bilgileri geçersiz hatası ver.
  if (!ok) throw new Error('Invalid credentials');

  // Kullanıcı kimliğini içeren JWT üret (7 gün geçerli).
  const token = jwt.sign({ sub: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
  // Üretilen token ve kullanıcı özet bilgilerini döndür.
  return { token, user: { id: user._id.toString(), email: user.email } };
} 