/**
 * Student Name: Krish Choudhary
 * Date: August 11, 2026
 * Program Description: Header navigation component for the Internet Movies Rental (IMR) web portal.
 * Inputs: Site branding layout configurations.
 * Processing: Formats and displays site branding.
 * Output: Renders sticky top navigation header bar.
 */

export default function Navbar() {
  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-wider text-red-500">IMR</span>
          <span className="text-sm font-medium text-gray-300 hidden sm:inline">Movie Portal</span>
        </div>
      </div>
    </header>
  );
}