import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-200 shadow-md mt-auto">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-700">
            &copy; 2024 Payam Hoseini. All rights reserved.
          </span>
          <div className="flex gap-4">
            <Link to="/about" className="text-slate-700 hover:underline">
              About
            </Link>
            <Link to="/privacy" className="text-slate-700 hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="text-slate-700 hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
