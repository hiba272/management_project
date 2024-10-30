import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './AppRoutes'; // Import routes
import Loader from './common/Loader';
import DefaultLayout from './layout/DefaultLayout';

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Check if the current route is for authentication
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  return loading ? (
    <Loader />
  ) : isAuthRoute ? (
    <AppRoutes /> // Render AppRoutes directly for authentication pages
  ) : (
    <DefaultLayout>
      <AppRoutes /> {/* Use the DefaultLayout for other routes */}
    </DefaultLayout>
  );
}

export default App;
