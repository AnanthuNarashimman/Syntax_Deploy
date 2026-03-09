import {
  Home,
  Plus,
  Settings,
  User,
  Users,
  TrendingUp,
  BookOpen,
  Database
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../Styles/ComponentStyles/AdminNavbar.css';
import { Button } from './Button';

const sidebarItems = [
  { id: 'home', label: 'Dashboard', icon: Home, route: '/admin-dashboard' },
  { id: 'create', label: 'Create Contest', icon: Plus, route: '/create-contest' },
  { id: 'problems', label: 'Problem Bank', icon: Database, route: '/problem-bank' },
  { id: 'manage', label: 'Manage Events', icon: Settings, route: '/manage-contest' },
  { id: 'participants', label: 'Students', icon: Users, route: '/manage-participants' },
  // { id: 'analytics', label: 'Analytics', icon: TrendingUp, route: '/analytics' }, // Under development
  { id: 'articles', label: 'Articles', icon: BookOpen, route: '/manage-articles' },
  { id: 'profile', label: 'Profile', icon: User, route: '/admin-profile' }
];

function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Determine active tab by matching current path
  const activeTab = sidebarItems.find(item => location.pathname.startsWith(item.route))?.id || 'home';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        navigate('/');
      } else {
        console.error('Logout failed');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="navbar-sidebar">
      <div className="navbar-header">
        <div className="navbar-logo">&lt; SYNTAX /&gt;</div>
        <p className="navbar-logo-subtitle">Admin Panel</p>
      </div>
      
      <nav className="navbar-nav">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`navbar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.route)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <Button className="navbar-logout-btn" onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </nav>
    </div>
  );
}

export default AdminNavbar
