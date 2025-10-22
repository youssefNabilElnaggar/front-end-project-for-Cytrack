import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// layouts and pages
import RootLayout from "./layouts/RootLayout";
import MapPage from "./pages/mapPage";
import LoginPage from "./pages/loginPage.jsx";
import ProtectedRoute from "./component/protectedRoute";
import Homepage from "./pages/Homepage.jsx";
import Details from "./component/details.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Redirect "/" → "/login"
      { index: true, element: <Navigate to="/login" replace /> },

      { path: "login", element: <LoginPage /> },
      {
        path: "map",
        element: (
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "homepage",
        element: (
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        ),
      },
      {
        path: "details/:id",
        element: (
          <ProtectedRoute>
            <Details />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
