import { Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Navbar from './components/NavBar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add other routes here as needed */}
      </Routes>
    </>
  );
}

export default App;
