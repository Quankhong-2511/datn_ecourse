import lessonApi from 'axiosConfig/api/lesson';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IndexedObject } from 'types/common';
import courseStore from 'zustandStore/course';

const useService = () => {
  const { lessons, getLessonsCourse } = courseStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      getLessonsCourse({ courseId: id });
    }
  }, [id]);

  // useEffect(() => {
  //   getLessons({ courseId: id });
  // }, [id]);
  return {
    lessons,
    id,
  };
};

export default useService;
