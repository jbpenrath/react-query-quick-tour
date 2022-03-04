import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Courses from './views/Courses';
import CourseEdit from './views/CourseEdit';
import Course from './views/Course';
import ErrorProvider from "./providers/ErrorProvider";
import { QueryClientProvider, QueryClient } from 'react-query';
import {ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      cacheTime: 60_000,
      refetchOnWindowFocus: false,
    }
  }
});

const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <ErrorProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Courses/>}/>
              <Route path="course">
                <Route path=":courseId" element={<Course />} />
                <Route path=":courseId/edit" element={<CourseEdit />} />
              </Route>
              <Route path="*" element={<h1>404 Not found.</h1>}/>
            </Routes>
          </BrowserRouter>
        </ErrorProvider>
      </QueryClientProvider>
  )
}

export default App
