import React from 'react';
import { Menu } from 'lucide-react';
import { useUiStore } from '../../stores/ui.store';
import PageTitle from './PageTitle';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { NotificationDropdown } from '../../features/notifications';
import ProfileDropdown from './ProfileDropdown';

export const Header = () => {
  const { setSidebar } = useUiStore();

  return (
    <header className="h-20 bg-card/80 backdrop-blur-md border-b border-border/60 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-300">
      {/* Left section: Hamburger & PageTitle */}
      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
        <button
          onClick={() => setSidebar(true)}
          className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden cursor-pointer shrink-0"
          aria-label="Open Mobile Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="space-y-1 min-w-0">
          <PageTitle />
        </div>
      </div>

      {/* Right section: SearchBar, ThemeToggle, NotificationDropdown, ProfileDropdown */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <SearchBar />
        <ThemeToggle />
        <NotificationDropdown />
        <div className="w-px h-6 bg-border/60 mx-1 hidden sm:block" />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
