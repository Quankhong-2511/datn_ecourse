import { CopyOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import courseApi from 'axiosConfig/api/course';
import CommonButton from 'components/CommonButton/CommonButton';
import { replacePathParams } from 'helpers/functions';
import useService from 'pages/User/CourseEdit/service';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MPath from 'routes/routes';
import authStore from 'zustandStore/auth';
import courseStore from 'zustandStore/course';

const CourseIntroduce: React.FC = () => {
  const { currentUser, setModalAuth } = authStore();
  const { course, getDetailCourse } = courseStore();
  const { id, members } = useService();
  const navigate = useNavigate();
  const location = useLocation();
  const paserQs = qs.parse(window.location.search);

  const handleBuyCourse = async (id: string) => {
    if (!currentUser.id) {
      setModalAuth('login');
      return;
    }
    if (paserQs?.uuid) {
      const res = await courseApi.activeUser(paserQs.uuid as string);
      navigate(MPath.USER_MY_COURSE);
      return;
    }
    if (currentUser.id) {
      try {
        await courseApi.buyCourse(id);
        toast.success('Đã mua khóa học thành công');
        navigate(MPath.USER_MY_COURSE);
      } catch (err) {
        toast.error('Số dư của bạn không đủ để mua khóa học này');
      }
    } else {
      try {
      } catch (err) {}
    }
  };
  const [link, setLink] = useState<string>('');

  const createLink = async (id: number) => {
    const res = await courseApi.createLink(id);
    setLink(res.data);
    return res;
  };

  const handleCopy = async () => {
    navigator.clipboard.writeText(link);
    toast.success('Copy link thành công');
  };

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDetailCourse(String(id));
  }, [id]);

  return (
    <div className="w-full h-[100%] flex flex-col item-start overflow-scroll p-4">
      <h3 className="text-xl font-bold text-center mb-2">{course.name}</h3>
      {course.file && course.file[0] && (
        <img
          className="w-[80%] h-[200px] mb-4 mx-auto object-contain"
          src={course.file && course.file[0].path}
          alt=""
        />
      )}
      <p className="text-sm mb-4">{course.content}</p>

      <div className="flex flex-col">
        {!currentUser.listCourse?.includes(course.id ?? 0) && (
          <p className="font-bold text-slate-600 mb-2">
            Bạn cảm thấy hứng thú với khóa học. Mua ngay với giá tiền{' '}
            {(course.lastPrice ?? 0).toLocaleString()}đ
          </p>
        )}
        <div className="font-bold">
          {currentUser.listCourse?.includes(course.id ?? 0) ? (
            <CommonButton
              onClick={() =>
                navigate(replacePathParams(MPath.USER_COURSE_DETAIL, { id: String(course.id) }))
              }
            >
              Học ngay
            </CommonButton>
          ) : (
            <CommonButton onClick={() => handleBuyCourse(String(id))}>Mua khóa học</CommonButton>
          )}
          {paserQs.uuid && (
            <p className="my-4">Mua khóa học từ đường link này để được giảm giá 10%</p>
          )}
          <>
            <div className="flex gap-2 items-center mt-3">
              <p className="font-bold text-slate-600 ">
                <s></s>
                {/* Chia sẻ để nhận 10% hoa hồng */}
                Chia sẻ thành công nhận hoa hồng 30%
              </p>
              <Button
                onClick={() => {
                  setOpen(true);
                  createLink(course.id ?? 0);
                  if (!currentUser.id) {
                    setModalAuth('login');
                    return;
                  }
                }}
              >
                Lấy link chia sẻ
              </Button>
            </div>
            {link && (
              <Modal
                title="Link chia sẻ của bạn"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={'50%'}
              >
                <div className="flex gap-2  text-slate-600">
                  <p className="mt-3">{link}</p>
                  <CopyOutlined className="text-2xl" onClick={handleCopy} />
                </div>
              </Modal>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default CourseIntroduce;
