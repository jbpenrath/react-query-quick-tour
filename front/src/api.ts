import {Course} from "./types/course";

const checkStatus = (response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error(`${response.status} - ${response.statusText}`);
}

export const getCourses = (page = 0) => {
  const urlParams = new URLSearchParams();
  urlParams.append('limit', "2");
  urlParams.append('page', page.toString());
  return fetch(`http://localhost:8055/items/course?${urlParams.toString()}`)
    .then(checkStatus)
    .then(response => response.data as Course[])
}

export const getCourse = (id: string) => fetch(`http://localhost:8055/items/course/${id}`)
  .then(checkStatus)
  .then(response => response.data as Course)

export const updateCourse = (id:string, data: Partial<Course>) =>
  fetch(`http://localhost:8055/items/course/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(response => response.data as Course);