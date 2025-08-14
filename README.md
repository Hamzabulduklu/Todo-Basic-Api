## Todo Basic API

Küçük ve öðretici bir yapýlacaklar listesi (Todo) REST API. Express (TypeScript) + MongoDB (Mongoose) + JWT kimlik doðrulama kullanýr.

### Özellikler
- **Kimlik doðrulama**: Kayýt ve giriþ (JWT).
- **Todo CRUD**: Listeleme, ekleme, güncelleme, silme.
- **Filtreleme ve sayfalama**: `status`, `page`, `limit` sorgu parametreleri.
- **Testler**: Vitest ile birim/entegrasyon testleri.

### Teknolojiler
- Node.js, Express 5, TypeScript
- MongoDB, Mongoose
- JWT, bcryptjs
- Vitest, Supertest

### Hýzlý Baþlangýç
1. Baðýmlýlýklarý yükleyin:
   ```bash
   npm install
   ```
2. Ortam deðiþkenlerini `.env` dosyasýna ekleyin:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todo_api
   JWT_SECRET=super-secret-key
   PORT=3000
   ```
3. Opsiyonel: Migrasyon ve seed (örnek veri) çalýþtýrýn:
   ```bash
   npm run migrate
   npm run seed
   ```
4. Geliþtirme sunucusunu baþlatýn:
   ```bash
   npm run dev
   ```

### NPM Scriptleri
- `dev`: Geliþtirme modunda çalýþtýrýr (hot-reload).
- `build`: TypeScript derlemesi.
- `start`: Derlenmiþ çýktýyý çalýþtýrýr (`dist`).
- `migrate`: Veritabaný koleksiyon/indeks hazýrlýðý.
- `seed`: Örnek veri yükler.
- `db:test`: Test için DB baðlantýsýný dener.
- `test`, `test:watch`: Vitest testleri.

### API
- **Health**
  - `GET /health` › `{ status: "ok" }`

- **Auth**
  - `POST /auth/register` › Body: `{ email, password }`
  - `POST /auth/login` › Body: `{ email, password }` › Yanýt: `{ token }`

- **Todos** (JWT zorunlu)
  - Header: `Authorization: Bearer <JWT_TOKEN>`
  - `GET /todos?status=new|blocked|done&page=1&limit=5`
  - `POST /todos` › Body: `{ title, status? }`
  - `PUT /todos/:id` › Body: `{ title?, status? }`
  - `DELETE /todos/:id`

Durum alaný deðerleri: `new`, `blocked`, `done`.

### Test Çalýþtýrma
```bash
npm test
```

### Lisans
ISC

### Baðlantýlar
- GitHub depo: `https://github.com/Hamzabulduklu/Todo-Basic-Api.git`
