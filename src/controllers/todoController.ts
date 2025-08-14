/*
  Todo HTTP denetleyicisi (Express Router).
  - Listeleme (GET /)
  - Ekleme (POST /)
  - Güncelleme (PUT /:id)
  - Silme (DELETE /:id)
*/
// Express Router sınıfını içe aktar.
import { Router } from 'express';
// Todo işlem servis fonksiyonlarını içe aktar.
import { listTodos, addTodo, updateTodo, deleteTodo } from '../services/todoService.js';
// Kimlik doğrulama middleware'ini içe aktar.
import { authMiddleware } from '../middleware/auth.js';

// Express router örneği oluştur.
const router = Router();

// Tüm todo rotaları için kimlik doğrulama zorunlu hale getir.
router.use(authMiddleware);

// Todo listesi getirme endpoint'i tanımla (sayfalama ve durum filtresi ile).
router.get('/', async (req, res) => {
  try {
    // Sayfa numarasını al, yoksa 1 kullan.
    const page = parseInt(req.query.page as string) || 1;
    // Sayfa başına öğe sayısını al, yoksa 5 kullan.
    const limit = parseInt(req.query.limit as string) || 5;

    // Durum filtresi parametresini al.
    const statusParam = req.query.status as string | undefined;
    // Geçerli durum değerlerini tanımla.
    let status: 'new' | 'blocked' | 'done' | undefined = undefined;
    // Durum parametresi varsa kontrol et.
    if (statusParam !== undefined) {
      // Geçerli durum değerlerinden biri mi kontrol et.
      if (statusParam === 'new' || statusParam === 'blocked' || statusParam === 'done') {
        // Geçerliyse status değişkenine ata.
        status = statusParam;
      } else {
        // Geçersizse 400 hatası döndür.
        return res.status(400).json({ error: "Invalid status. Allowed: 'new', 'blocked', 'done'" });
      }
    }

    // Todo listesini getir.
    const todos = await listTodos(req.userId as string, page, limit, status);
    // Sonucu JSON olarak döndür.
    res.json(todos);
  } catch (error) {
    // Hata durumunda 500 hatası döndür.
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Yeni todo ekleme endpoint'i tanımla.
router.post('/', async (req, res) => {
  try {
    // İstek gövdesinden başlık ve durum bilgilerini al.
    const { title, status } = req.body;
    // Başlık eksikse 400 hatası döndür.
    if (!title) return res.status(400).json({ error: 'Title is required' });
    // Yeni todo'yu ekle.
    const todo = await addTodo(req.userId as string, title, status);
    // Eklenen todo'yu JSON olarak döndür.
    res.json(todo);
  } catch (error: any) {
    // Hata durumunda 400 hatası ile hata mesajını döndür.
    res.status(400).json({ error: error.message || 'Bad Request' });
  }
});

// Todo güncelleme endpoint'i tanımla.
router.put('/:id', async (req, res) => {
  try {
    // URL parametresinden todo ID'sini al ve sayıya çevir.
    const id = parseInt(req.params.id);
    // Todo'yu güncelle.
    const updated = await updateTodo(req.userId as string, id, req.body);
    // Todo bulunamadıysa 404 hatası döndür.
    if (!updated) return res.status(404).json({ error: 'Todo not found' });
    // Güncellenmiş todo'yu JSON olarak döndür.
    res.json(updated);
  } catch (error: any) {
    // Hata durumunda 400 hatası ile hata mesajını döndür.
    res.status(400).json({ error: error.message || 'Bad Request' });
  }
});

// Todo silme endpoint'i tanımla.
router.delete('/:id', async (req, res) => {
  try {
    // URL parametresinden todo ID'sini al ve sayıya çevir.
    const id = parseInt(req.params.id);
    // Todo'yu sil.
    const deleted = await deleteTodo(req.userId as string, id);
    // Todo bulunamadıysa 404 hatası döndür.
    if (!deleted) return res.status(404).json({ error: 'Todo not found' });
    // Başarılı silme mesajını JSON olarak döndür.
    res.json({ success: true });
  } catch (error) {
    // Hata durumunda 500 hatası döndür.
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Router'ı dışa aktar.
export default router;
