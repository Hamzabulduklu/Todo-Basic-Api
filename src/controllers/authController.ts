// Express Router sınıfını içe aktar.
import { Router } from 'express';
// Kimlik doğrulama servis fonksiyonlarını içe aktar.
import { registerUser, loginUser } from '../services/authService.js';

// Express router örneği oluştur.
const router = Router();

// Kullanıcı kaydı için POST endpoint'i tanımla.
router.post('/register', async (req, res) => {
  try {
    // İstek gövdesinden e‑mail ve parola bilgilerini al.
    const { email, password } = req.body as { email?: string; password?: string };
    // E‑mail veya parola eksikse 400 hatası döndür.
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    // Kullanıcı kaydını gerçekleştir.
    const user = await registerUser(email, password);
    // Başarılı kayıt sonucunu JSON olarak döndür.
    res.json(user);
  } catch (err: any) {
    // Hata durumunda 400 hatası ile hata mesajını döndür.
    res.status(400).json({ error: err.message || 'Bad Request' });
  }
});

// Kullanıcı girişi için POST endpoint'i tanımla.
router.post('/login', async (req, res) => {
  try {
    // İstek gövdesinden e‑mail ve parola bilgilerini al.
    const { email, password } = req.body as { email?: string; password?: string };
    // E‑mail veya parola eksikse 400 hatası döndür.
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    // Kullanıcı girişini gerçekleştir.
    const result = await loginUser(email, password);
    // Başarılı giriş sonucunu JSON olarak döndür.
    res.json(result);
  } catch (err: any) {
    // Hata durumunda 400 hatası ile hata mesajını döndür.
    res.status(400).json({ error: err.message || 'Bad Request' });
  }
});

// Router'ı dışa aktar.
export default router; 