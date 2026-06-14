import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { LandingPage } from "./components/home/LandingPage";


function App() {

  const publicRoutes = [
    {path: '/', element: <LandingPage />},
  ];

  const routes = [
    ...publicRoutes
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
