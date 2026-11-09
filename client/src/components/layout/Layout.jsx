import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-ink-800 antialiased">
      <a
        className="absolute -left-[9999px] top-3 z-100 rounded-lg bg-ink-900 px-4 py-2.5 text-white focus:left-4"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
