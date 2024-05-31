import courseApi from 'axiosConfig/api/course';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TUser } from 'types/user';
import courseStore from 'zustandStore/course';

const useService = () => {
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<TUser[]>([]);
  const { lessons, getDetailCourse, getLessonsCourse, course } = courseStore();

  const getMembers = async (id: string) => {
    const res = await courseApi.getMembersCourse(id);
    const { admin, members } = res.data.data;
    const arrMember = [admin, ...members]
      .map((e) => e.members)
      .map((x) => ({ ...x, role: x.teacher ? 'Giáo viên' : 'Học sinh' }));
    setMembers(arrMember);
  };

  useEffect(() => {
    if (id) {
      getLessonsCourse({ courseId: id });
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getDetailCourse(String(id));
    getMembers(String(id));
  }, [id]);

  return { id, members, lessons, getLessonsCourse, course};
};

export default useService;
