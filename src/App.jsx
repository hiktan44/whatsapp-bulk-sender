import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Preview from './pages/preview/Preview';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/preview/:mediaKey',
    element: <Preview />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true
  }
});

function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}

export default App;