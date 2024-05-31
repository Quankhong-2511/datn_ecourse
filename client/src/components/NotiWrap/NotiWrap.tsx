import notiApi from 'axiosConfig/api/noti';
import CommonButton from 'components/CommonButton/CommonButton';
import { replacePathParams } from 'helpers/functions';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MPath from 'routes/routes';
import { TNoti } from 'types/noti';
import authStore from 'zustandStore/auth';
import notiStore from 'zustandStore/noti';

const NotiWrap = () => {
  const navigate = useNavigate();
  const { currentUser } = authStore();
  // const [notis, setNotis] = useState<TNoti[]>([]);
  const { listNoti, getNotis } = notiStore();

  const readAll = async () => {
    await notiApi.readAll(currentUser.id ?? 0);
    getNotis();
  };

  const readOneNoti = async (id: number, e: TNoti) => {
    await notiApi.readOneNoti(id);
    getNotis();
    if (e.type === 3) {
      navigate(replacePathParams(MPath.USER_COURSE_DETAIL, { id: String(e.courseId) }));
      return;
    }
    if (e.type === 4) {
      navigate(
        `${replacePathParams(MPath.USER_COURSE_DETAIL, { id: String(e.courseId) })}?lessionId=${
          e.lessonId
        }`,
      );
      return;
    }
    if (e.type === 5) {
      navigate(replacePathParams(MPath.USER_COURSE_LESSONS, { id: String(e.courseId) }));
      return;
    }
  };

  useEffect(() => {
    getNotis();
  }, []);
  return (
    <div className="wrapper-noti !z-1000000 p-2 relative max-h-[500px]">
      <div className="scroll-wrapper max-h-[440px] overflow-scroll h-fit">
        {listNoti.map((e) => {
          return (
            <div
              className={`item-bell ${e.status && e.status[0] === 0 ? 'unread' : ''}`}
              onClick={() => readOneNoti(e.id ?? 0, e)}
            >
              <img
                className="item-bell-icon rounded-[50%] w-[50px] h-[50px] flex items-center justify-center"
                src={`${''}`}
              />
              <div className="item-bell-inf">
                {e.type === 3 && (
                  <p className="font-bold">{`Khóa học ${e.courseName} vừa có bài học mới được duyệt`}</p>
                )}
                {e.type === 4 && (
                  <p className="font-bold">{`Bài học ${e.lessonName} có bình luận mới`}</p>
                )}
                {e.type === 5 && (
                  <p className="font-bold">{`Bài học ${e.courseName} vừa có bài học bị hủy`}</p>
                )}

                <span className="item-bell-discription">{e.content}</span>
                <span className="item-bell-time">{moment(e.createdAt).format('DD-MM-YYYY')}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className=" w-full">
        <CommonButton onClick={readAll}>Đọc tất cả</CommonButton>
      </div>
    </div>
  );
};

export default NotiWrap;
