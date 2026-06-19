import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { LandingPage } from "./components/home/LandingPage";
import { Dashboard } from "./components/dashboard/Dashboard";
import { useAuth } from "./components/contexts/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isLoggedIn ? element : <Navigate to="/" replace />;
};

function App() {
  const { isLoggedIn } = useAuth();

  const publicRoutes = [
    {path: '/', element: <LandingPage />},
  ];

  const protectedRoutes = [
    {path: '/dashboard', element: <ProtectedRoute element={<Dashboard />} />},
  ];

  const routes = [
    ...publicRoutes,
    ...protectedRoutes
  ];

  const Router = createBrowserRouter(routes, {
    initialEntries: ["/"],
    initialIndex: 0,
  });

  return (
    <>
      <RouterProvider router={Router}/>
    </>
  );
}

export default App;
