import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import VideoGrid from './components/VideoGrid.jsx';
import Loader from './components/Loader.jsx';

const Login = lazy(() => import('./pages/Login.jsx'));
const SignUp = lazy(() => import('./pages/SignUp.jsx'));
const NotFound = lazy(() => import('./components/NotFound.jsx'));
const Profile = lazy(() => import('./components/Profile.jsx'));
const CreateChannel = lazy(() => import('./pages/CreateChannel.jsx'));
const VideoView = lazy(() => import('./components/VideoView.jsx'));
const ChannelDetail = lazy(() => import('./components/ChannelDetail.jsx'));
const UploadVideo = lazy(() => import('./pages/UploadVideo.jsx'));
const SearchVideos = lazy(() => import('./components/SearchVideos.jsx'));
const EditVideo = lazy(() => import('./components/EditVideo.jsx'));

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <Suspense fallback={<Loader />}> 
        <NotFound /> {/* Fallback for not found page */}
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: <VideoGrid />, // Default route
      },
      {
        path: '/search/:searchItem',
        element: (
          <Suspense fallback={<Loader />}>
            <SearchVideos /> {/* Lazy load SearchVideos component */}
          </Suspense>
        ),
      },
      {
        path: '/profile/:_id',
        element: (
          <Suspense fallback={<Loader />}>
            <Profile /> {/* Lazy load Profile component */}
          </Suspense>
        ),
      },
      {
        path: '/watch/:_id',
        element: (
          <Suspense fallback={<Loader />}>
            <VideoView /> {/* Lazy load VideoView component */}
          </Suspense>
        ),
      },
      {
        path: '/channel/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <ChannelDetail /> {/* Lazy load ChannelDetail component */}
          </Suspense>
        ),
      },
      {
        path: '/signup',
        element: (
          <Suspense fallback={<Loader />}>
            <SignUp /> {/* Lazy load SignUp component */}
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<Loader />}>
            <Login /> {/* Lazy load Login component */}
          </Suspense>
        ),
      },
      {
        path: '/channel',
        element: (
          <Suspense fallback={<Loader />}>
            <CreateChannel /> {/* Lazy load CreateChannel component */}
          </Suspense>
        ),
      },
      {
        path: '/uploadVideo',
        element: (
          <Suspense fallback={<Loader />}>
            <UploadVideo /> {/* Lazy load UploadVideo component */}
          </Suspense>
        ),
      },
      {
        path: '/editVideo/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <EditVideo /> {/* Lazy load EditVideo component */}
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter} /> {/* Provide router to the app */}
    </Provider>
  </StrictMode>
);
