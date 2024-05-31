import courseApi from 'axiosConfig/api/course';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TUser } from 'types/user';
import courseStore from 'zustandStore/course';

const useService = () => {
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<TUser[]>([]);
  const [admins, setAdmins] = useState<TUser[]>([]);
  const { getDetailCourse } = courseStore();

  const getMembers = async (id: string) => {
    const res = await courseApi.getMembersCourse(id);
    const { admin, members } = res.data.data;
    const arrMember = [
      { ...admin.user, role: 'Giáo viên' },
      ...members.map((e) => ({ ...e.user, price: ((e.price ?? 0) - Number(e.reduced ?? 0)).toLocaleString(), role: 'Học sinh' })
      ),

    ];
    setMembers(arrMember);
    const listAdmins = admin.user;
    setAdmins(listAdmins);
  };

  useEffect(() => {
    if (!id) return;
    getDetailCourse(String(id));
  }, [id]);

  useEffect(() => {
    if (id !== 'create') getMembers(String(id));
  }, []);
  return { id, members };
};

export default useService;
