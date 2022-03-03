import {Children, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ComponentState, type Course} from "../types/course";
import {getCourses} from "../api";

const CoursesView = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [state, setState] = useState<ComponentState>(ComponentState.IDLE);
  const [page, setPage] = useState<number | null>(1);
  const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle:"short",
    timeStyle: "short"
  });
  const increasePage = () => {
    if (page!== null) {
      setPage(page + 1)
    }
  }


  useEffect(() => {
    if (page !== null && courses.length !== 2 * page) {
      setState(ComponentState.LOADING);
      getCourses(page)
        .then((nextCourses) => {
          if (nextCourses.length === 0) {
            setPage(null)
          } else {
            setCourses(c => c.concat(nextCourses))
          }
        })
        .finally(() => setState(ComponentState.IDLE))
    }
  }, [page])

  if (courses.length === 0 && state === 'loading') {
    return <div aria-busy="true" />
  }

  return (
    <div className="container">
      <table className="container-fluid">
        <thead>
          <tr>
            <th>Illustration</th>
            <th>Titre</th>
            <th>Résumé</th>
            <th>Mis à jour</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {Children.toArray(courses.map((course) => (
          <tr>
            <td><img src={`http://localhost:8055/assets/${course.illustration}`} width="128" alt="Course cover" /></td>
            <td>{course.title}</td>
            <td>{course.excerpt}</td>
            <td>{dateFormatter.format(new Date(course.date_updated || course.date_created))}</td>
            <td><span data-tooltip={course.status} className={`status status--${course.status}`} /></td>
            <td><Link role={"button"} to={`course/${course.id}`}>Edit</Link></td>
          </tr>
        )))}
        </tbody>
      </table>
      <button className="secondary" aria-busy={state === ComponentState.LOADING} disabled={page === null} onClick={increasePage}>Voir plus ...</button>
    </div>
  );
}

export default CoursesView;