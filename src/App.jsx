import { Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Navbar from './components/NavBar';
import AboutMe from './screens/AboutMe';
import Designs from './screens/Designs';
import FAQ from './screens/FAQ';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/designs" element={<Designs />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </>
  );
}

export default App;
