import {Link, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import MDEditor from '@uiw/react-md-editor';
import {Course} from "../types/course";
import {getCourse, updateCourse} from "../api";
import {useError} from "../providers/ErrorProvider";

const CourseEdit = () => {
  const { courseId } = useParams()
  const formRef = useRef<HTMLFormElement>(null);
  const queryKey = ['courses', courseId];
  const { data: course, isError, isLoading } = useQuery(queryKey, () => getCourse(courseId!));
  const { setError } = useError();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Partial<Course>) => updateCourse(courseId!, data),
    onMutate: (variables: Partial<Course>) => {
      const previousCourse = queryClient.getQueryData(queryKey) as Course;
      queryClient.setQueryData(queryKey, {...previousCourse, ...variables});

      return { previousCourse };
    },
    onSuccess: () => {
      formRef.current?.reset();
      queryClient.invalidateQueries(['courses'], { exact: true })
    },
    onError: (error: Error, newCourse, context) => {
      queryClient.setQueryData(queryKey, context?.previousCourse)
      setError(error.toString());
    }
  });
  const [content, setContent] = useState(course?.content);
  const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: "full",
    timeStyle: "short",
  })

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    mutation.mutate({...Object.fromEntries(formData), content});
  }

  useEffect(() => {
    setContent(course?.content)
  }, [course])


  if (isError) {
    return <h3 className="container">Oups ! Cannot retrieve information for course "{courseId}".</h3>
  }

  if (!course || isLoading) {
    return <div aria-busy={true}/>
  }

  return (
    <div className="container">
      <header className="course-header">
        <Link role="button" className="secondary" to={"/"}>Back</Link>
        <div className="course-header__metadata">
          <h1 className="course-header__title">
            {course.title}
          </h1>
          <p className="course-header__date">Mis à jour le {dateFormatter.format(new Date(course.date_updated || course.date_created))}</p>
        </div>
      </header>
      <form ref={formRef} onSubmit={handleSubmit}>
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
        <button aria-busy={mutation.isLoading} disabled={mutation.isLoading} type="submit">Modifier</button>
      </form>
    </div>
  )
}

export default CourseEdit;