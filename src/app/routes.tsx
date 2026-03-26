import { createBrowserRouter } from 'react-router';
import { Dashboard } from './pages/dashboard';
import { SessionDetailView } from './pages/session-detail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Dashboard,
  },
  {
    path: '/session/:sessionId',
    Component: SessionDetailView,
  },
]);