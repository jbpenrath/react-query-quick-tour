import {Link, useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {getCourse} from "../api";
import MDEditor from "@uiw/react-md-editor";

const CourseView = () => {
  const { courseId } = useParams();
  const { data: course, isLoading } = useQuery(['courses', courseId], () => getCourse(courseId!));

  const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: "full",
    timeStyle: "short",
  })

  if (!course || isLoading) {
    return <div aria-busy={true} />
  }

  return (
    <div className="course container">
      <header style={{backgroundImage: `url(http://localhost:8055/assets/${course.illustration})`}} className="course-header">
        <div className="course-header__actionBar">
        <Link role={"button"} className="secondary" to="/">Back</Link>
        <Link role={"button"} to="edit">Edit</Link>
        </div>
        <div className="course-header__metadata">
          <h1 className="course-header__title">{course.title}</h1>
          <p className="course-header__date">{dateFormatter.format(new Date(course.date_updated || course.date_created))}</p>
        </div>
      </header>
      <p>{course.excerpt}</p>
      <MDEditor.Markdown source={course.content} />
    </div>
  )
}

export default CourseView;