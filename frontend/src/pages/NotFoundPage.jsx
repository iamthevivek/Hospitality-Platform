import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <h1 className="text-9xl font-bold text-primary-600">404</h1>
      <h2 className="text-3xl font-semibold mt-4 text-gray-800">Page Not Found</h2>
      <p className="text-gray-500 mt-2 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
        Go Home
      </Link>
    </div>
  );
}
