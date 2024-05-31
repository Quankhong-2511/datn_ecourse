import { Modal, Table, TableProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import lessonApi from 'axiosConfig/api/lesson';
import CommonButton from 'components/CommonButton/CommonButton';
import useService from 'pages/User/LessonList/service';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TLesson } from 'types/course';

const LessonAccept: React.FC = () => {
  const { id, getLessonsCourse, lessons, course } = useService();

  const [lesson, setLesson] = useState<TLesson | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');

  const navigate = useNavigate();

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      width: '40%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'stautus',
      render: (text) => {
        let color =
          text === 'Đã duyệt'
            ? 'green'
            : text === 'Chờ duyệt'
              ? 'orange'
              : text === 'Hủy'
                ? 'red'
                : 'default';
        return (
          <span
            style={{
              width: 100,
              backgroundColor: color,
              color: 'white',
              padding: '5px',
              borderRadius: '3px',
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <CommonButton
          danger
          onClick={() => {
            setLesson(record);
          }}
        >
          Chi tiết
        </CommonButton>
      ),
    },
  ];

  const handleAccept = async () => {
    await lessonApi.accept(lesson?.id ?? 0, 'Đã duyệt');
    setLesson({});
    getLessonsCourse({ courseId: id });
  };

  const handleCancel = async () => {
    await lessonApi.accept(lesson?.id ?? 0, 'Hủy', { reason });
    setLesson({});
    getLessonsCourse({ courseId: id });
    setModal(false);
    setReason('');
  };

  useEffect(() => {
    if (id) getLessonsCourse({ courseId: id });
  }, [id]);

  return (
    <div className="w-full h-[100%] flex flex-col item-start overflow-scroll p-4">
      <h2 className="text-center font-bold text-xl">Danh sách bài học cần duyệt của khóa học "{course.name}" </h2>
      <Modal open={modal} footer={null}>
        <div className="p-4">
          <p className="font-bold text-xl">Xác nhận hủy</p>
          <TextArea
            placeholder="Lý do từ chối"
            className="w-full mb-2 mt-4"
            onChange={(e) => setReason(e.target.value)}
            value={reason}
          />
          <div className="mt-8 flex justify-end gap-12">
            <CommonButton
              onClick={() => {
                setModal(false);
              }}
            >
              Bỏ qua
            </CommonButton>
            <CommonButton danger type="primary" onClick={handleCancel}>
              Hủy khóa học
            </CommonButton>
          </div>
        </div>
      </Modal>
      <Modal open={!!lesson?.name} onCancel={() => setLesson({})} footer={null} width={'50vw'}>
        <div className="p-4">
          <p className="font-bold text-xl">Chi tiết bài học</p>
          <p className="mt-4">{`Tên : ${lesson?.name}`}</p>
          <p className="mt-2 italic">{lesson?.content}</p>
          {lesson?.file && lesson?.file[0] && (
            <video className="w-full h-[450px]" controls src={lesson?.file[0].path}></video>
          )}

          {lesson?.status === 'Chờ duyệt' && (
            <div className="mt-8 flex justify-end gap-12">
              <CommonButton
                danger
                onClick={() => {
                  setModal(true);
                  delete lesson.name
                }}
              >
                Hủy
              </CommonButton>
              <CommonButton type="primary" onClick={handleAccept}>
                Phê duyệt
              </CommonButton>
            </div>
          )}
        </div>
      </Modal>
      <Table columns={columns} dataSource={lessons} pagination={false} />
    </div>
  );
};

export default LessonAccept;
