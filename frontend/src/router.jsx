import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/Error/ErrorPage';
import MoviePage from './pages/Movie/MoviePage';
import HomePage from './pages/Home/HomePage';
import SearchResults from './pages/Search/SearchResults';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import WatchlistPage from './pages/Watchlist/WatchlistPage';
import OurStoryPage from './pages/OurStory/OurStoryPage';
import SentimentAnalysisPage from './pages/SentimentAnalysis/SentimentAnalysisPage';
import ProtectedRoute from './components/common/routes/ProtectedRoute';
import CareersPage from './pages/Careers/CareersPage';
import ContactPage from './pages/Contact/ContactPage';
import FAQPage from './pages/FAQ/FAQPage';
import SupportPage from './pages/Support/SupportPage';
import BlogPage from './pages/Blog/BlogPage';
import TermsPage from './pages/Legal/TermsPage';
import PrivacyPage from './pages/Legal/PrivacyPage';
import CookiesPage from './pages/Legal/CookiesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/movies/:movieId',
    element: <MoviePage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/search',
    element: <SearchResults/>,
    errorElement: <ErrorPage />

  },
  {
    path: '/profile',
    element: <ProfilePage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/our-story',
    element: <OurStoryPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/sentiment-analysis',
    element: <SentimentAnalysisPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/careers',
    element: <CareersPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/contact',
    element: <ContactPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/faq',
    element: <FAQPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/support',
    element: <SupportPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/blog',
    element: <BlogPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/terms',
    element: <TermsPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/cookies',
    element: <CookiesPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/watchlist',
    element: (
      <ProtectedRoute>
        <WatchlistPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: '*',
    element: <ErrorPage error={{ status: 404 }} />
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  }
]);

export default router;