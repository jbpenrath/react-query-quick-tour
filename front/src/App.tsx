import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Courses from './views/Courses';
import Course from './views/Course';
import ErrorProvider from "./providers/ErrorProvider";

const App = () => {
  return (
      <ErrorProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Courses/>}/>
            <Route path="course/:courseId" element={<Course/>}/>
            <Route path="*" element={<h1>404 Not found.</h1>}/>
          </Routes>
        </BrowserRouter>
      </ErrorProvider>
  )
}

export default App
