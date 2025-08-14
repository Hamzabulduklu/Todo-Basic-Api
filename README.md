## Todo Basic API

K���k ve ��retici bir yap�lacaklar listesi (Todo) REST API. Express (TypeScript) + MongoDB (Mongoose) + JWT kimlik do�rulama kullan�r.

### �zellikler
- **Kimlik do�rulama**: Kay�t ve giri� (JWT).
- **Todo CRUD**: Listeleme, ekleme, g�ncelleme, silme.
- **Filtreleme ve sayfalama**: `status`, `page`, `limit` sorgu parametreleri.
- **Testler**: Vitest ile birim/entegrasyon testleri.

### Teknolojiler
- Node.js, Express 5, TypeScript
- MongoDB, Mongoose
- JWT, bcryptjs
- Vitest, Supertest

### H�zl� Ba�lang��
1. Ba��ml�l�klar� y�kleyin:
   ```bash
   npm install
   ```
2. Ortam de�i�kenlerini `.env` dosyas�na ekleyin:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todo_api
   JWT_SECRET=super-secret-key
   PORT=3000
   ```
3. Opsiyonel: Migrasyon ve seed (�rnek veri) �al��t�r�n:
   ```bash
   npm run migrate
   npm run seed
   ```
4. Geli�tirme sunucusunu ba�lat�n:
   ```bash
   npm run dev
   ```

### NPM Scriptleri
- `dev`: Geli�tirme modunda �al��t�r�r (hot-reload).
- `build`: TypeScript derlemesi.
- `start`: Derlenmi� ��kt�y� �al��t�r�r (`dist`).
- `migrate`: Veritaban� koleksiyon/indeks haz�rl���.
- `seed`: �rnek veri y�kler.
- `db:test`: Test i�in DB ba�lant�s�n� dener.
- `test`, `test:watch`: Vitest testleri.

### API
- **Health**
  - `GET /health` � `{ status: "ok" }`

- **Auth**
  - `POST /auth/register` � Body: `{ email, password }`
  - `POST /auth/login` � Body: `{ email, password }` � Yan�t: `{ token }`

- **Todos** (JWT zorunlu)
  - Header: `Authorization: Bearer <JWT_TOKEN>`
  - `GET /todos?status=new|blocked|done&page=1&limit=5`
  - `POST /todos` � Body: `{ title, status? }`
  - `PUT /todos/:id` � Body: `{ title?, status? }`
  - `DELETE /todos/:id`

Durum alan� de�erleri: `new`, `blocked`, `done`.

### Test �al��t�rma
```bash
npm test
```

### Lisans
ISC

### Ba�lant�lar
- GitHub depo: `https://github.com/Hamzabulduklu/Todo-Basic-Api.git`
