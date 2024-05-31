import { Table, TableProps } from 'antd';
import courseApi from 'axiosConfig/api/course';
import CommonButton from 'components/CommonButton/CommonButton';
import { replacePathParams } from 'helpers/functions';
import useService from 'pages/User/LessonList/service';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MPath from 'routes/routes';
import { TCourses } from 'types/course';
import authStore from 'zustandStore/auth';

const CourseAccept: React.FC = () => {
  const { currentUser } = authStore();
  const { id, getLessonsCourse, lessons } = useService();

  const [courses, setCourses] = useState<TCourses[]>([]);

  const navigate = useNavigate();

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      width: '60%',
    },
    {
      title: 'Giáo viên',
      dataIndex: ['user', 'name'],
      key: 'user.name',
      width: '15%',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <CommonButton
          type="primary"
          onClick={() => {
            navigate(replacePathParams(MPath.ADMIN_LESSON, { id: record.id }));
          }}
        >
          Chi tiết
        </CommonButton>
      ),
    },
  ];

  const data = lessons;

  const getListCourseAccept = async () => {
    const res = await courseApi.getCourses({ statusLesson: 'Chờ duyệt' });
    console.log(res.data.data.items);
    setCourses(res.data.data.items);
  };
  useEffect(() => {
    getListCourseAccept();
  }, []);

  return (
    <div className="w-full h-[100%] flex flex-col item-start overflow-scroll p-4">
      <h2 className="text-center font-bold text-xl">Danh sách khóa học cần duyệt</h2>
      <Table columns={columns} dataSource={courses} pagination={false} />
    </div>
  );
};

export default CourseAccept;
