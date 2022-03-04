import { Children } from "react";
import { useInfiniteQuery } from "react-query";
import { Link } from "react-router-dom";
import {type Course} from "../types/course";
import {getCourses} from "../api";

const CoursesView = () => {
  const { data, isFetching, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    'courses',
    ({ pageParam }) => getCourses(pageParam || 1),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return undefined;
        return allPages.length + 1
      },
    }
  )

  const courses: Course[] = data?.pages.flat() || [];

  const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle:"short",
    timeStyle: "short"
  });

  if (courses.length === 0 && isLoading) {
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
            <td><Link to={`course/${course.id}`}>{course.title}</Link></td>
            <td>{course.excerpt}</td>
            <td>{dateFormatter.format(new Date(course.date_updated || course.date_created))}</td>
            <td><span data-tooltip={course.status} className={`status status--${course.status}`} /></td>
            <td><Link role={"button"} to={`course/${course.id}/edit`}>Edit</Link></td>
          </tr>
        )))}
        </tbody>
      </table>
      <button className="secondary" aria-busy={isFetching} disabled={!hasNextPage} onClick={() => fetchNextPage()}>Voir plus ...</button>
    </div>
  );
}

export default CoursesView;