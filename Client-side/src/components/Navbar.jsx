import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiHeart, FiUserPlus } from 'react-icons/fi';
import { IoLanguageOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import SearchBar from './SearchBar';
import { useTranslation } from '../context/TranslationContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const location = useLocation();
  
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { language, setLanguage, t } = useTranslation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const menuItems = [
    { name: t('home'), path: '/' },
    { name: t('products'), path: '/products' },
    { name: t('wishlist'), path: '/wishlist' },
    { name: t('cart'), path: '/cart' },
  ];

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <motion.span 
              className="text-2xl font-bold text-primary-accent hover:text-brand-highlight transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              AdeyBloom
            </motion.span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-primary-text hover:text-primary-accent transition-colors duration-300 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Items */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Switcher */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="ml-4 border rounded p-1"
            >
              <option value="en">EN</option>
              <option value="am">አማ</option>
            </select>
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex items-center text-primary-text hover:text-primary-accent relative transition-colors duration-300"
            >
              <FiHeart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-secondary-accent text-primary-accent rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4 relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="flex items-center text-primary-text hover:text-primary-accent transition-colors duration-300 focus:outline-none"
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={isProfileDropdownOpen}
                >
                  <FiUser className="h-5 w-5" />
                  <span className="ml-2 font-medium">{user.name ? user.name.split(' ')[0] : (user.firstName || '')}</span>
                </button>
                {/* Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-primary-text hover:bg-gray-100 w-full text-left"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      {t('profile')}
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsProfileDropdownOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-primary-text hover:bg-gray-100"
                    >
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : location.pathname === '/signin' ? (
              <Link
                to="/signup"
                className="text-primary-text hover:text-primary-accent transition-colors duration-300 font-medium"
              >
                {t('signUpHeader')}
              </Link>
            ) : (
              <Link
                to="/signin"
                className="text-primary-text hover:text-primary-accent transition-colors duration-300 font-medium"
              >
                {t('signInHeader')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-text hover:text-primary-accent transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search Bar - Mobile */}
              <div className="px-4 py-2">
                <SearchBar />
              </div>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block px-3 py-2 text-primary-text hover:text-primary-accent transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex items-center justify-between px-3 py-2">
                  <motion.button
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-1 text-primary-text hover:text-primary-accent transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IoLanguageOutline className="h-5 w-5" />
                    <span className="font-medium">{language}</span>
                  </motion.button>
                  
                  {/* Wishlist - Mobile */}
                  <Link
                    to="/wishlist"
                    className="text-primary-text hover:text-primary-accent relative transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiHeart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-secondary-accent text-primary-accent rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="text-primary-text hover:text-primary-accent transition-colors duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="h-5 w-5" />
                      </Link>
                      <motion.button
                        onClick={handleLogout}
                        className="text-primary-text hover:text-coral-rose transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiLogOut className="h-5 w-5" />
                      </motion.button>
                    </>
                  ) : location.pathname === '/signin' ? (
                    <Link
                      to="/signup"
                      className="text-primary-text hover:text-primary-accent transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUserPlus className="h-5 w-5" />
                    </Link>
                  ) : (
                    <Link
                      to="/signin"
                      className="text-primary-text hover:text-primary-accent transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="h-5 w-5" />
                    </Link>
                  )}
                  <Link
                    to="/cart"
                    className="text-primary-text hover:text-primary-accent relative transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary-accent text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;