import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <img
          src="https://images.unsplash.com/photo-1611890798517-07b0fcb4a811?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fDQwNHxlbnwwfHwwfHx8MA%3D%3D"
          alt="404 Image"
          className="mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Page not found</h1>
        <p className="text-gray-600 mb-8">The page you are looking for might be in another castle.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
