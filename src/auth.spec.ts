// Vitest test yardımcılarını içe aktar (yaşam döngüsü ve assertion fonksiyonları).
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
// Express uygulamasına HTTP istekleri atmak için supertest'i içe aktar.
import request from 'supertest';
// Test edilecek Express uygulamasını içe aktar.
import app from './app.js';
// Veritabanı bağlantı yardımcılarını içe aktar.
import { connectToDatabase } from './data/db.js';
// In-memory Mongo kurulum/temizlik yardımcılarını içe aktar.
import { startInMemoryMongo, stopInMemoryMongo } from './test/utils/testDb.js';

// Kimlik doğrulama uç noktalarını test eden test grubu.
describe('Auth API', () => {
  beforeAll(async () => {
    // Test öncesi: In-memory MongoDB başlat ve bağlan.
    const uri = await startInMemoryMongo();
    await connectToDatabase(uri);
  });

  afterAll(async () => {
    // Test sonrası: In-memory MongoDB ve bağlantıları kapat.
    await stopInMemoryMongo();
  });

  it('registers and logs in a user', async () => {
    // Testte kullanılacak örnek kullanıcı bilgileri.
    const email = 'user@example.com';
    const password = 'StrongP@ssw0rd';

    // Register
    // Kayıt isteği gönder ve 200 bekle.
    const registerRes = await request(app)
      .post('/auth/register')
      .send({ email, password })
      .expect(200);

    // Dönen yanıtta id ve email olmalı.
    expect(registerRes.body).toHaveProperty('id');
    expect(registerRes.body).toHaveProperty('email', email);

    // Login
    // Giriş isteği gönder ve 200 bekle.
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    // Dönen yanıtta token ve user bilgisi olmalı.
    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body).toHaveProperty('user');
    expect(loginRes.body.user).toHaveProperty('email', email);
  });
});


