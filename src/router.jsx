import {createBrowserRouter} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import QuestionsPage from "./pages/QuestionsPage/QuestionsPage.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Question, {loaderQuestion} from "./pages/Question/Question.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        index: true,
        element: <QuestionsPage />,
        ErrorBoundary: ErrorBoundary,
      },
      {
        path: 'questions/:id',
        element: <Question />,
        ErrorBoundary: ErrorBoundary,
        loader: loaderQuestion

      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])