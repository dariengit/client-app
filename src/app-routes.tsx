import { HomePage, TasksPage, ProfilePage, DemoListPage, TestListPage } from './pages';
import { withNavigationWatcher } from './contexts/navigation';

const routes = [
    {
        path: '/tasks',
        element: TasksPage
    },
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/home',
        element: HomePage
    }, 
  {
    path: '/demo-list',
    element: DemoListPage
  }, 
  {
    path: '/test-list',
    element: TestListPage
  }
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
