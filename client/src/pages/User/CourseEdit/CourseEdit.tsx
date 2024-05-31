import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Table, TableProps, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import authApi from 'axiosConfig/api/auth';
import courseApi from 'axiosConfig/api/course';
import uploadApi from 'axiosConfig/api/upload';
import CommonButton from 'components/CommonButton/CommonButton';
import { replacePathParams } from 'helpers/functions';
import useService from 'pages/User/CourseEdit/service';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MPath from 'routes/routes';
import authStore from 'zustandStore/auth';
import courseStore from 'zustandStore/course';

const CourseEdit: React.FC = () => {
  const { saveCurrentUser, currentUser } = authStore();
  const { listCategory, course, saveCourse } = courseStore();
  const { id, members } = useService();
  const [form] = useForm();
  const navigate = useNavigate();
  const checkIsDetail = id !== 'create';
  const [file, setFile] = useState<File | null>(null);
  const [nameFile, setNameFile] = useState<string>('');
  const uploadRef = useRef<HTMLInputElement>(null);
  const [dataFile, setDataFile] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [mail, setMail] = useState<string>('');
  const columns: TableProps<any>['columns'] = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'age',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'address',
    },
    {
      title: 'Học phí',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  const getCurrentUser = async () => {
    const res = await authApi.getCurrentUser();
    const { me, listCourse } = res.data;
    saveCurrentUser({ ...me, listCourse });
  };

  const onSubmit = async (data) => {
    try {
      if (checkIsDetail) {
        const res = (await courseApi.updateCourse(String(id), {
          ...data,
          ...(file ? { file: [file] } : {}),
        })) as any;
        saveCourse({ ...course, ...res.data?.data });
        toast.success('Cập nhật khóa học thành công');
        setDataFile(null);
      } else {
        if (!file) {
          toast.error('Hãy tải lên ảnh nền bài học');
          return;
        }
        await courseApi.createCourse({ ...data, file: [file] });
        await getCurrentUser();
        toast.success('Tạo khóa học thành công');
        navigate(MPath.USER_HOME);
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleCancelCreateCourse = async () => {
    navigate(MPath.USER_HOME);
  };

  const handleUpload = async (e) => {
    const typeFile = e.target.files[0].type as string;
    if (!typeFile.includes('png') && !typeFile.includes('jp')) {
      toast.error('Vui lòng upload file đúng định dạng image');
      return;
    }
    setLoading(true);
    const file = e.target.files[0];
    setDataFile(file);
    const form = new FormData();
    form.append('file', file);
    const res = await uploadApi.upload(form);
    const fileData = (res.data as any).data[0];
    setNameFile(fileData.name);
    setFile(fileData.path);
    setLoading(false);
  };

  useEffect(() => {
    if (checkIsDetail) {
      form.setFieldsValue({
        name: course.name,
        price: course.price,
        discount: course.discount,
        commission: course.commission,
        category: course.category,
        content: course.content,
      });
    } else {
      setFile(null);
      setDataFile(null);
    }
  }, [course.id]);

  const listOptions = listCategory.map((e) => ({ value: e.id, label: e.title }));

  const handleSendInvite = async () => {
    try {
      await courseApi.inviteMember(String(id), mail);
      toast.success('Gửi lời mời tham gia khóa học thành công');
    } catch (err) {
      toast.error('Không thành công. Email đã tham gia khóa học');
    }
  };
  return (
    <div className="w-full h-[100%] flex flex-col item-start overflow-scroll p-4">
      <h2 className="text-center font-bold text-xl">
        {checkIsDetail ? 'Chi tiết khóa học' : 'Tạo khóa học mới'}
      </h2>
      <Form className="mt-6" onFinish={onSubmit} form={form}>
        <div className="flex">
          <div className="flex flex-col w-[50%]">
            <Form.Item label="Tên khóa học" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Nội dung" name="content">
              <TextArea />
            </Form.Item>

            <Form.Item label="Giá tiền" name="price">
              <InputNumber />
            </Form.Item>
            <Form.Item label="Giảm giá" name="discount">
              <InputNumber />
            </Form.Item>
            {/* <Form.Item label="Hoa hồng chia sẻ" name="commission">
              <InputNumber />
            </Form.Item> */}
            <Form.Item label="Danh mục" name="category">
              <Select options={listOptions} />
            </Form.Item>
            {checkIsDetail && (
              <>
                {members.find((e: any) => e?.id === currentUser?.id && e?.role === 'Học sinh') ===
                  undefined && (
                  <p>Tổng doanh thu của khóa học là: {course.revenue?.toLocaleString()}đ</p>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col items-center w-full relative">
            {nameFile ? (
              <p className="font-bold text-sm">{nameFile}</p>
            ) : (
              <div
                className={`${
                  course.file && course.file[0] ? 'py-2 px-4' : 'p-12'
                } border-2 border-dashed border-slate-600 rounded-md`}
                onClick={() => uploadRef.current?.click()}
              >
                <PlusOutlined />
              </div>
            )}
            {course.file && course.file[0] && (
              <img
                className="h-[200px] w-[150px] object-cover"
                src={dataFile ? URL.createObjectURL(dataFile) : course.file[0].path}
                alt=""
              />
            )}
            {loading && <span className="font-bold">Uploading</span>}
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
              <span className="mt-2">Tải lên ảnh nền</span>
            )}
          </div>
        </div>

        <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
          {checkIsDetail ? (
            <>
              {members.find((e: any) => e?.id === currentUser?.id && e?.role === 'Học sinh') ===
                undefined && (
                <div className=" flex gap-2">
                  <Button danger onClick={handleCancelCreateCourse}>
                    Hủy
                  </Button>
                  <CommonButton type="primary" htmlType="submit">
                    Lưu chỉnh sửa
                  </CommonButton>
                </div>
              )}
            </>
          ) : (
            <div className=" flex gap-2">
              <Button danger onClick={handleCancelCreateCourse}>
                Hủy
              </Button>
              <CommonButton type="primary" htmlType="submit">
                Tạo khóa học
              </CommonButton>
            </div>
          )}
        </Form.Item>
      </Form>

      {checkIsDetail && (
        <>
          {members.find((e: any) => e?.id === currentUser?.id && e?.role === 'Học sinh') ===
            undefined && (
            <Link to={replacePathParams(MPath.USER_COURSE_LESSONS, { id: String(id) })}>
              <CommonButton type="primary" className="w-[30%] mb-4">
                Quản lý danh sách bài học
              </CommonButton>
            </Link>
          )}
          {/* {members.find((e: any) => e?.role === 'Giáo viên')?.id !== currentUser?.id && ( */}
            <div className="mb-4 w-[50%]">
              <p>Mời bạn bè tham gia khóa học</p>
              <div className="flex gap-4">
                <Input placeholder="Nhập email bạn bè" onChange={(e) => setMail(e.target.value)} />
                <CommonButton type="primary" onClick={handleSendInvite}>
                  Gửi lời mời
                </CommonButton>
              </div>
            </div>
          {/* )} */}
          <h3>Danh sách học sinh</h3>
          <Table columns={columns} dataSource={members} />
        </>
      )}
    </div>
  );
};

export default CourseEdit;
