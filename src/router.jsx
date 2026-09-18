import {createBrowserRouter} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import QuestionsPage from "./pages/QuestionsPage/QuestionsPage.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Question from "./pages/Question/Question.jsx";
import RootErrorBoundary from "./components/ErrorBoundary.jsx";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        element: <QuestionsPage />,
        ErrorBoundary: RootErrorBoundary,
      },
      {
        path: 'questions/:id',
        element: <Question />,
        ErrorBoundary: RootErrorBoundary,

      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])