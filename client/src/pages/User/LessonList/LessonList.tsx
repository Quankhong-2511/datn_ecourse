import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Table, TableProps, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import CommonButton from 'components/CommonButton/CommonButton';
import useService from 'pages/User/LessonList/service';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from 'zustandStore/auth';
import courseStore from 'zustandStore/course';
import uploadApi from 'axiosConfig/api/upload';
import { toast } from 'react-toastify';
import lessonApi from 'axiosConfig/api/lesson';
import MPath from 'routes/routes';
import { TLesson } from 'types/course';

const LessonList: React.FC = () => {
  const { currentUser } = authStore();
  const { course } = courseStore();
  const { id, getLessonsCourse, lessons } = useService();

  const [file, setFile] = useState<File | null>(null);
  const [nameFile, setNameFile] = useState<string>('');

  const navigate = useNavigate();

  const [add, setAdd] = useState<boolean>(false);

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Tên bài học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
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
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
      render: (_, record) => {
        return (
          <span
            style={{
              padding: '5px',
              borderRadius: '3px',
              wordWrap: 'break-word',
            }}
          >
            {record.reason ?? ''}
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
            setEdit(record);
            setModal('edit');
            setDataEdit(record);
          }}
        >
          Sửa
        </CommonButton>
      ),
    },
  ];

  const data = lessons;

  const onSubmit = async (data) => {
    if (!file) {
      toast.error('Yêu cầu tải lên video bài học');
      return;
    }
    await lessonApi.createLesson({
      ...data,
      file: [file],
      publish: 1,
      tag: 'Learing',
      courseId: Number(id),
    });
    setFile(null);
    setNameFile('');
    getLessonsCourse({ courseId: id });
    setAdd(false);
  };

  const handleCancelCreate = async () => {
    navigate(MPath.USER_EDIT_COURSE);
  };

  const handleUpload = async (e) => {
    const typeFile = e.target.files[0].type as string;
    if (!typeFile.includes('video')) {
      toast.error('Vui lòng upload file đúng định dạng video');
      return;
    }
    const file = e.target.files[0];
    const form = new FormData();
    form.append('file', file);
    const res = await uploadApi.upload(form);
    const fileData = (res.data as any).data[0];
    setNameFile(fileData.name);
    setFile(fileData.path);
  };

  const uploadRef = useRef<HTMLInputElement>(null);

  const [modal, setModal] = useState<'' | 'edit'>('');

  const [edit, setEdit] = useState<TLesson>({});
  const [dataEdit, setDataEdit] = useState<{
    name: string;
    content: string;
  }>({
    name: '',
    content: '',
  });

  const handleEdit = async () => {
    try {
      await lessonApi.update(edit.id ?? 0, { ...dataEdit, publish: 1, tag: 'Learing' });
      setEdit({});
      setModal('');
      getLessonsCourse({ courseId: id });
      toast.success('Sửa khóa học thành công');
    } catch (err) {
      toast.error('Sửa khóa học thất bại');
    }
  };

  return (
    <div className="w-full h-[100%] flex flex-col item-start overflow-scroll p-4">
      <Modal
        title="Chỉnh sửa bài học"
        open={modal === 'edit'}
        onOk={handleEdit}
        onCancel={() => {
          setEdit({});
          setModal('');
        }}
        okText="Sửa"
        cancelText="Hủy"
      >
        <p className="font-bold mt-2">Tên bài học: </p>
        <Input
          defaultValue={edit.name}
          // value={edit.name}
          onChange={(e) => setDataEdit({ ...dataEdit, name: e.target.value })}
        />
        <p className="font-bold mt-8">Nội dung:</p>
        <TextArea
          defaultValue={edit.content}
          // value={edit.content}
          onChange={(e) => setDataEdit({ ...dataEdit, content: e.target.value })}
        />
      </Modal>
      <h2 className="text-center font-bold text-xl">Quản lý bài học</h2>
      <CommonButton className="w-fit mt-2 mb-2" onClick={() => setAdd(!add)}>
        {add ? 'Hủy' : 'Thêm bài học mới'}
      </CommonButton>
      {add && (
        <div className="mt-4 mb-4">
          <Form className="mt-6" onFinish={onSubmit}>
            <div className="flex justify-between">
              <div className="flex flex-col w-[50%]">
                <Form.Item label="Tên bài học" name="name">
                  <Input />
                </Form.Item>
                <Form.Item label="Nội dung" name="content">
                  <TextArea />
                </Form.Item>
              </div>
              <div className="flex flex-col items-center w-full">
                {nameFile ? (
                  <p className="font-bold text-sm">{nameFile}</p>
                ) : (
                  <div
                    className="p-12 border-2 border-dashed border-slate-600 rounded-md"
                    onClick={() => uploadRef.current?.click()}
                  >
                    <PlusOutlined />
                  </div>
                )}
                <input
                  ref={uploadRef}
                  name="file"
                  type="file"
                  className="hidden"
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                />
                {file ? (
                  <span
                    className="mt-2 cursor-pointer"
                    onClick={() => {
                      setFile(null);
                      setNameFile('');
                    }}
                  >
                    Xoá file
                  </span>
                ) : (
                  <span className="mt-2">Tải lên video bài học</span>
                )}
              </div>
            </div>

            <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
              <Button danger onClick={handleCancelCreate} className="mr-2">
                Hủy
              </Button>
              <CommonButton type="primary" htmlType="submit">
                Thêm bài học
              </CommonButton>
            </Form.Item>
          </Form>
        </div>
      )}
      <Table columns={columns} dataSource={data.reverse()} />
    </div>
  );
};

export default LessonList;
