import { lazy, Suspense } from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// remove import otherwise loaded eagerly
// import BlogPage, { loader as postsLoader } from './pages/Blog';
import HomePage from './pages/Home';
// import PostPage, { loader as postLoader } from './pages/Post';
import RootLayout from './pages/Root';

// load lazily; 'lazy' allows BlogPage to be used as a Component
// and not as a Promise
const BlogPage = lazy(() => import('./pages/Blog'));

const PostPage = lazy(() => import('./pages/Post'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'posts',
        children: [
          { index: true,
            // wrap in Suspense due to load latency 
            element: <Suspense fallback={<p>Loading...</p>}><BlogPage /></Suspense>,
            // 'import' executed once loader for BlogPage is executed
            // occurs when BlogPage visited; import yields a Promise
            loader: () => import('./pages/Blog').then(module => module.loader())},
          { 
            path: ':id', 
            element: <Suspense fallback={<p>Loading...</p>}><PostPage /></Suspense>, 
            loader: (meta) => import('./pages/Post').then((module) => module.loader(meta))
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
