import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/supabase';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductIssueModal } from '../components/ProductIssueModal';

interface ProductIssue {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'resolved';
  product_id: string;
  created_at: string;
  updated_at: string;
  admin_response?: string | null;
}

export const IssuesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issues, setIssues] = useState<ProductIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('issue_reporting')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error) {
      toast.error('Sorunlar yüklenirken bir hata oluştu');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeIssues = issues.filter(issue => issue.status === 'active');
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved');

  return (
    <>
      <Header 
        cartItemCount={0}
        isAdminView={false}
        onToggleView={() => {}}
        onShowAllProducts={() => {}}
        showAllProducts={false}
        onCategorySelect={() => {}}
        onShowHome={() => window.location.href = '/'}
        onCartClick={() => {}}
        onProductSelect={() => {}}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
        <div className="max-w-4xl mx-auto px-4">
          {/* Geri Butonu */}
          <button
            onClick={() => navigate('/account')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 
                     transition-colors duration-200 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Hesabım</span>
          </button>

          {/* Başlık ve Sorun Oluşturma Butonu */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Ürün Sorularım</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl
                       hover:bg-gray-800 transition-colors duration-200"
            >
              <Plus size={20} />
              <span>Sorun Talep Oluştur</span>
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : (
            <div className="space-y-8">
              {/* Aktif Sorunlar */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-orange-500" />
                  Aktif Sorunlarım
                </h2>
                {activeIssues.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 text-gray-500 text-center">
                    Aktif sorun talebiniz bulunmuyor.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeIssues.map(issue => (
                      <div key={issue.id} className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-900">{issue.title}</h3>
                          <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">
                            Aktif
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                        <div className="text-sm text-gray-500">
                          {new Date(issue.created_at).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Çözülen Sorunlar */}
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-500" />
                  Çözüme Kavuşturulan Sorunlarım
                </h2>
                {resolvedIssues.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 text-gray-500 text-center">
                    Çözüme kavuşturulan sorun talebiniz bulunmuyor.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resolvedIssues.map(issue => (
                      <div key={issue.id} className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-900">{issue.title}</h3>
                          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                            Çözüldü
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                        {issue.admin_response && (
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-gray-600">{issue.admin_response}</p>
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          Çözüm tarihi: {new Date(issue.updated_at).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductIssueModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchIssues();
        }}
      />
    </>
  );
}; 