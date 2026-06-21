import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { LandingPage } from "./components/home/LandingPage";
import { Dashboard } from "./components/dashboard/Dashboard";
import { SessionLobby } from "./components/session/SessionLobby";
import { RunScreen } from "./components/run/RunScreen";
import { RunSummary } from "./components/run/RunSummary";
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
    {path: '/session/:id', element: <ProtectedRoute element={<SessionLobby />} />},
    {path: '/run/:id', element: <ProtectedRoute element={<RunScreen />} />},
    {path: '/summary/:id', element: <ProtectedRoute element={<RunSummary />} />},
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
