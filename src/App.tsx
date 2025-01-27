import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { AnnouncementProvider } from './context/AnnouncementContext';
import { CategoryProvider } from './context/CategoryContext';
import { ProductProvider } from './context/ProductContext';
import { HomeSectionProvider } from './context/HomeSectionContext';
import { CartProvider } from './context/CartContext';
import { FeaturedCategoryProvider } from './context/FeaturedCategoryContext';
import { AppContent } from './components/AppContent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AccountPage } from './components/AccountPage';
import { FavoriteProvider } from './context/FavoriteContext';
import { AddressInformation } from './components/AddressInformation';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { AddressesPage } from './pages/AddressesPage';
import { IssuesPage } from './pages/IssuesPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <FavoriteProvider>
          <SettingsProvider>
            <CategoryProvider>
              <ProductProvider>
                <HomeSectionProvider>
                  <CartProvider>
                    <AnnouncementProvider>
                      <FeaturedCategoryProvider>
                        <Router>
                          <Routes>
                            <Route path="/" element={<AppContent />} />
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/account/profile" element={<ProfilePage />} />
                            <Route path="/account/orders" element={<OrdersPage />} />
                            <Route path="/account/addresses" element={<AddressesPage />} />
                            <Route path="/account/issues" element={<IssuesPage />} />
                            <Route path="/address-information" element={<AddressInformation />} />
                          </Routes>
                        </Router>
                      </FeaturedCategoryProvider>
                    </AnnouncementProvider>
                  </CartProvider>
                </HomeSectionProvider>
              </ProductProvider>
            </CategoryProvider>
          </SettingsProvider>
        </FavoriteProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;