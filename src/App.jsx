import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './screens/Home';
import Navbar from './components/NavBar';
import Designs from './screens/Designs';
import FAQ from './screens/FAQ';
import Admin from './screens/Admin';
import AllServicesPage from './screens/Services';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/designs" element={<Designs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/services" element={<AllServicesPage />} />
      </Routes>
    </>
  );
}

export default App;