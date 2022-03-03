import {Link, useParams} from "react-router-dom";
import {ComponentState, Course} from "../types/course";
import {useEffect, useState} from "react";
import MDEditor from '@uiw/react-md-editor';
import {getCourse, updateCourse} from "../api";
import {useError} from "../providers/ErrorProvider";

const CourseView = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [state, setState] = useState<ComponentState>(ComponentState.IDLE);
  const [formState, setFormState] = useState<ComponentState>(ComponentState.IDLE);
  const [content, setContent] = useState(course?.content);
  const { setError } = useError();
  const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: "full",
    timeStyle: "short",
  })

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    setFormState(ComponentState.LOADING);

    updateCourse(courseId!, { ...Object.fromEntries(formData), content })
      .then(setCourse)
      .catch(() => setError('Cannot update course.'))
      .finally(() => setFormState(ComponentState.IDLE));
  }

  useEffect(() => {
    if (courseId === undefined) {
      setState(ComponentState.ERROR)
      return;
    }

    setState(ComponentState.LOADING)
    getCourse(courseId)
      .then(setCourse)
      .then(() => setState(ComponentState.IDLE))
      .catch(() => setState(ComponentState.ERROR))
  }, [])

  useEffect(() => {
    setContent(course?.content)
  }, [course])

  if (state === ComponentState.ERROR) {
    return <h3 className="container">Oups ! Cannot retrieve information for course "{courseId}".</h3>
  }

  if (!course || state === ComponentState.LOADING) {
    return <div aria-busy={true}/>
  }

  return (
    <div className="course container">
      <header className="course-header">
        <Link role="button" className="secondary" to={"/"}>Back</Link>
        <div className="course-header__metadata">
          <h1 className="course-header__title">
            {course.title}
          </h1>
          <p className="course-header__date">Mis à jour le {dateFormatter.format(new Date(course.date_updated || course.date_created))}</p>
        </div>
      </header>
      <img className="course-cover" src={`http://localhost:8055/assets/${course.illustration}`} alt="Course cover" />
      <form onSubmit={handleSubmit}>
        <div className="grid">
        <label>Title
          <input name="title" type="text" defaultValue={course.title} />
        </label>
        <label>
          Status
          <select name="status" defaultValue={course.status}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        </div>
        <label>Excerpt
        <textarea name="excerpt" defaultValue={course.excerpt} />
        </label>
        <label>Content
          <MDEditor
            height={400}
            value={content}
            onChange={setContent}
          />
        </label>
        <button aria-busy={formState === ComponentState.LOADING} disabled={formState === ComponentState.LOADING} type="submit">Modifier</button>
      </form>
    </div>
  )
}

export default CourseView;