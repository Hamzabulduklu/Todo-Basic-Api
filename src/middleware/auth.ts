// JSON Web Token işlemleri için jsonwebtoken kütüphanesini içe aktar.
import jwt from 'jsonwebtoken';
// Express türlerini (Request, Response, NextFunction) içe aktar.
import { Request, Response, NextFunction } from 'express';
// Sabit JWT gizli anahtarını içe aktar.
import { JWT_SECRET } from '../config.js';

/*
  JWT doğrulama middleware'i.
  - Authorization: Bearer <token>
  - Geçerli ise req.userId alanına kullanıcı id'sini set eder
*/
// İstekleri doğrulayan middleware fonksiyonunu dışa aktar.
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Authorization başlığını al; yoksa boş string kullan.
    const header = req.headers.authorization || '';
    // Başlığı şema ve token olarak ayır (örn. "Bearer <token>").
    const [scheme, token] = header.split(' ');
    // Şema Bearer değilse ya da token yoksa 401 döndür.
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Token'i sabit gizli anahtar ile doğrula ve payload'ı elde et.
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    // İstek içine kullanıcı kimliğini yerleştir.
    (req as any).userId = payload.sub;
    // Sonraki middleware/route'a geç.
    next();
  } catch (err) {
    // Herhangi bir doğrulama hatasında 401 döndür.
    return res.status(401).json({ error: 'Invalid token' });
  }
} 