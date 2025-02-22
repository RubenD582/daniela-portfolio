import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Navbar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter basename="/daniela">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </BrowserRouter>
  );
}

export default App;
