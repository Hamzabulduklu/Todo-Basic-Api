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

// Testler için bir kullanıcı oluşturup token döndüren yardımcı fonksiyon.
async function registerAndLogin() {
  const email = `user_${Date.now()}@example.com`;
  const password = 'StrongP@ssw0rd';
  await request(app).post('/auth/register').send({ email, password }).expect(200);
  const loginRes = await request(app).post('/auth/login').send({ email, password }).expect(200);
  return loginRes.body.token as string;
}

// Todo uç noktalarını test eden test grubu.
describe('Todos API', () => {
  beforeAll(async () => {
    // Test öncesi: In-memory MongoDB başlat ve bağlan.
    const uri = await startInMemoryMongo();
    await connectToDatabase(uri);
  });

  afterAll(async () => {
    // Test sonrası: In-memory MongoDB ve bağlantıları kapat.
    await stopInMemoryMongo();
  });

  // Todo oluşturma, listeleme, güncelleme ve silme akışını test eder.
  it('creates, lists, updates and deletes a todo', async () => {
    const token = await registerAndLogin();

    // Create
    // Yeni bir todo oluştur ve 200 bekle.
    const createRes = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My first todo' })
      .expect(200);

    // Dönen yanıtta id ve title olmalı.
    expect(createRes.body).toHaveProperty('id');
    expect(createRes.body).toHaveProperty('title', 'My first todo');

    // List
    // Todo listesini çek ve dizi dönmesini bekle.
    const listRes = await request(app)
      .get('/todos?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);

    // Update
    // Oluşturulan todo id'si ile status'ü done yap.
    const todoId = createRes.body.id;
    const updateRes = await request(app)
      .put(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' })
      .expect(200);

    // Güncellenmiş statü dönmeli.
    expect(updateRes.body).toHaveProperty('status', 'done');

    // Delete
    // Todo'yu sil ve success true dönmesini bekle.
    const deleteRes = await request(app)
      .delete(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(deleteRes.body).toHaveProperty('success', true);
  });
});


