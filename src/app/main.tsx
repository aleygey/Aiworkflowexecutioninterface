import { RouterProvider } from 'react-router';
import { router } from './routes';

export function Main() {
  return <RouterProvider router={router} />;
}

export default Main;
