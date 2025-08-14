// Express web framework'ünü içe aktar.
import express from 'express';
// Todo işlemleri controller'ını içe aktar.
import todoRouter from './controllers/todoController.js';
// Kimlik doğrulama controller'ını içe aktar.
import authRouter from './controllers/authController.js';

// Express uygulaması örneği oluştur.
const app = express();

// JSON gövde parse eden middleware'i ekle.
app.use(express.json());

// Sağlık kontrolü için basit endpoint.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Auth rotaları (public)
app.use('/auth', authRouter);

// Todo rotaları
app.use('/todos', todoRouter);

export default app;


