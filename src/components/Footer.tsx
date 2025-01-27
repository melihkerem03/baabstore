import React, { useState } from 'react';
import { Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-white pt-12 pb-6 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Kategoriler */}
          <div>
            <h3 className="font-medium mb-4">Kategoriler</h3>
            <ul className="space-y-2">
            
              <li><a href="#" className="text-gray-600 hover:text-black">Elbise</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Abiye</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Gömlek</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Pantolon</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Çanta</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Trençkot</a></li>
            </ul>
          </div>

          {/* Önemli Bilgiler */}
          <div>
            <h3 className="font-medium mb-4">Önemli Bilgiler</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">Kargo ve Teslimat Koşulları</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Üyelik Sözleşmesi</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Satış Sözleşmesi</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">İade ve Değişim Koşulları</a></li>
            </ul>
          </div>

          {/* Hızlı Erişim */}
          <div>
            <h3 className="font-medium mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">Anasayfa</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Yeni Ürünler</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Sepetim</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Hakkımızda</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Mağazalarımız</a></li>
            </ul>
          </div>

          {/* MANUKA */}
          <div>
            <h3 className="font-medium mb-4">Baabstore</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                <strong>Adres:</strong>  Baabstore Tekstil Ith.İhr. San. ve Tic.Ltd.Şti. Maltepe Mah. Eski Çırpıcı Yolu Sok.No 2/2/5 Zeytinburnu İSTANBUL
              </li>
              <li>
                <strong>Whatsapp & Çağrı Merkezi:</strong>
                <a href="tel:08503085632" className="text-gray-600 hover:text-black"> 0850 308 56 32</a>
              </li>
              <li>
                <strong>E-posta:</strong>
                <a href="mailto:iletisim@baabstore.com.tr" className="text-gray-600 hover:text-black"> iletisim@baabstore.com.tr</a>
              </li>
              <li>
                <strong>İş Birliği:</strong>
                <a href="mailto:isbirligi@baabstore.com.tr" className="text-gray-600 hover:text-black"> isbirligi@baabstore.com.tr</a>
              </li>
            </ul>
          </div>
        </div>

        {/* E-Bülten Aboneliği */}
        <div className="mb-8">
          <h3 className="text-center font-medium mb-4">E-BÜLTEN ABONELİĞİ</h3>
          <form onSubmit={handleSubscribe} className="max-w-xl mx-auto">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi giriniz."
                className="flex-1 border border-r-0 border-black p-2 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
              >
                abone ol
              </button>
            </div>
            <div className="mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" required className="form-checkbox" />
                <span className="text-sm text-gray-600">
                  KVKK sözleşmesini Okudum, Kabul Ediyorum.
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Social Media & Copyright */}
        <div className="text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-4 hover:opacity-75 transition-opacity"
          >
            <Instagram size={24} />
          </a>
          <p className="text-sm text-gray-500">
            © 2025 baabstoree.com.tr Tüm hakları saklıdır. Site içindeki resimler izinsiz kopyalanamaz ve yayınlanamaz.
          </p>
        </div>
      </div>
    </footer>
  );
}; 