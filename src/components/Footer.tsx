/**
 * Student Name: Krish Choudhary
 * Date: August 11, 2026
 * Program Description: Static footer component displaying corporate contact details for IMR.
 * Inputs: Static text layout configurations.
 * Processing: Displays corporate information and support contact metrics cleanly.
 * Output: Renders bottom site footer section across pages.
 */

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400 border-t border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="text-white text-base font-semibold mb-2">Internet Movies Rental Company (IMR)</h3>
          <p className="text-gray-400">
            Updating and managing the ultimate movie database system efficiently.
          </p>
        </div>

        <div className="md:text-right">
          <h4 className="text-white text-base font-semibold mb-2">Contact Details</h4>
          <p>© 2026 Internet Movie Rentals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}