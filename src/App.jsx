import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased">
        {/* Shared Navbar on every page */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        {/* Shared Footer on every page */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;