import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const { login, register } = useAuth();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });
        onClose();
        window.location.href = '/account';
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
        setRegistrationSuccess(true);
      }
    } catch (error: any) {
      console.error('Auth error details:', {
        message: error.message,
        code: error.code,
        details: error.details
      });

      let errorMessage = 'Bir hata oluştu';
      
      if (error.message) {
        switch (error.message) {
          case 'Email already registered':
            errorMessage = 'Bu e-posta adresi zaten kayıtlı';
            break;
          case 'Invalid login credentials':
            errorMessage = 'Geçersiz e-posta veya şifre';
            break;
          case 'Password should be at least 6 characters':
            errorMessage = 'Şifre en az 6 karakter olmalıdır';
            break;
          case 'Email not confirmed':
            errorMessage = 'E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.';
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Kayıt Başarılı!</h2>
            <p className="text-gray-600 mb-4">
              E-posta adresinize bir doğrulama bağlantısı gönderdik. 
              Lütfen e-postanızı kontrol edin ve hesabınızı doğrulayın.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Ad Soyad</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">E-posta</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Şifre</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 border rounded pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-blue-600 hover:underline"
          >
            {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten üye misiniz? Giriş yapın'}
          </button>
        </form>
      </div>
    </div>
  );
};