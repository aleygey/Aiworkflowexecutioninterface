import { createBrowserRouter } from 'react-router';
import App from './App';
import { SessionDetailView } from './pages/session-detail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/session/:sessionId',
    Component: SessionDetailView,
  },
]);
