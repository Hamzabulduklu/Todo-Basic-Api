// Express'in temel türlerini içe aktar.
import 'express-serve-static-core';

// Express Request arayüzünü genişletmek için modül tanımı.
declare module 'express-serve-static-core' {
  // Request arayüzüne userId alanı ekle.
  interface Request {
    // Kimlik doğrulama middleware'i tarafından eklenen kullanıcı kimliği.
    userId?: string;
  }
} 