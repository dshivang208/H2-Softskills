import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import ServiceDetail from './Pages/ServiceDetail';
import Projects from './Pages/Projects';
import CaseStudy from './Pages/CaseStudy';
import Blog from './Pages/Blog';
import BlogPost from './Pages/BlogPost';
import Contact from './Pages/Contact';
import AdminLogin from './Pages/AdminLogin';
import AdminHome from './Pages/AdminHome';
import AdminDashboard from './Pages/AdminDashboard';
import AdminBlogs from './Pages/AdminBlogs';
import AdminServices from './Pages/AdminServices';
import AdminCaseStudies from './Pages/AdminCaseStudies';
import AdminProjects from './Pages/AdminProjects';
import AdminServiceDetails from './Pages/AdminServiceDetails';
import AdminTestimonials from './Pages/AdminTestimonials';
import AdminClientLogos from './Pages/AdminClientLogos';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId/case-study" element={<CaseStudy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/newsletter"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <AdminBlogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <AdminServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/case-studies"
            element={
              <ProtectedRoute>
                <AdminCaseStudies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/service-details"
            element={
              <ProtectedRoute>
                <AdminServiceDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute>
                <AdminTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/client-logos"
            element={
              <ProtectedRoute>
                <AdminClientLogos />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;