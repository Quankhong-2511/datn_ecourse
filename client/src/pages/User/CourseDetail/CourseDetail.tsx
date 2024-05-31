import { PlayCircleOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar/avatar';
import TextArea from 'antd/es/input/TextArea';
import lessonApi from 'axiosConfig/api/lesson';
import CommonButton from 'components/CommonButton/CommonButton';
import { replacePathParams } from 'helpers/functions';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MPath from 'routes/routes';
import { TLesson } from 'types/course';
import courseStore from 'zustandStore/course';
import useService from './service';

const CourseDetail: React.FC = () => {
  const { lessons, id } = useService();
  const [tab, setTab] = useState<'des' | 'cmt'>('des');
  const [lession, setLession] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [cmt, setCmt] = useState<string>('');
  const handleComment = async () => {
    await lessonApi.comment({
      lessonId: lession,
      content: cmt,
      file: [],
    });
    getDetailLession(lession);
    setCmt('');
  };
  const [detailLession, setDetailLession] = useState<TLesson>({});
  const { course, getDetailCourse } = courseStore();

  const classActiveTab = 'text-black';
  const classUnactiveTab = 'text-white bg-slate-600';

  const getDetailLession = async (id: number) => {
    if (!id) return;
    const res = await lessonApi.detail(String(lession));
    setDetailLession(res.data.data);
  };

  useEffect(() => {
    const parseQs = qs.parse(window.location.search);
    if (parseQs.lessionId) {
      setLession(Number(parseQs.lessionId as any) ?? 0);
    } else {
      if (lessons && !!lessons.length) setLession(lessons[lessons.length - 1].id as any);
    }
  }, [lessons]);

  useEffect(() => {
    if (!id) return;
    getDetailCourse(String(id));
  }, [id]);

  useEffect(() => {
    getDetailLession(lession);
  }, [lession]);

  // const { socket } = useSocket();

  useEffect(() => {}, []);

  return (
    <div className="w-full h-[100%] flex item-start overflow-hidden">
      <div className="w-[70%] flex flex-col overflow-scroll overflow-x-hidden px-2">
        <p className="font-bold text-xl text-orange-700">{`Khóa học ${course.name}`}</p>
        {detailLession?.file && detailLession?.file[0] && (
          <video className="w-full" controls src={detailLession?.file[0].path}></video>
        )}
        <div className="mt-2">
          {/* <h4 className="font-bold text-xl ">{detailLession.name ?? ''}</h4> */}
          {detailLession.id && (
            <div className="flex gap-6 mt-2 mb-2">
              <div
                className={`py-2 px-4 border-2 border-solid border-slate-600 rounded-lg cursor-pointer ${
                  tab === 'des' ? classActiveTab : classUnactiveTab
                }`}
                onClick={() => setTab('des')}
              >
                Mô tả
              </div>
              <div
                className={`py-2 px-4 border-2 border-solid border-slate-600 rounded-lg cursor-pointer ${
                  tab === 'cmt' ? classActiveTab : classUnactiveTab
                }`}
                onClick={() => setTab('cmt')}
              >
                Bình luận
              </div>
            </div>
          )}
          {tab === 'des' && <p className="text-base">{detailLession.content}</p>}
          {tab === 'cmt' && !!lession && (
            <div className="flex flex-col">
              <TextArea
                placeholder="Nhập bình luận của bạn về bài học này"
                className="w-full mb-2"
                onChange={(e) => setCmt(e.target.value)}
                value={cmt}
              />
              <CommonButton
                className="text-right w-fit ml-auto"
                type="primary"
                onClick={handleComment}
              >
                Bình luận
              </CommonButton>

              <div className="flex flex-col gap-2">
                {detailLession.comments?.map((e) => (
                  <div className="flex gap-2 items-center w-full">
                    <Avatar src={''} />
                    <p className="font-bold mr-2">{`${e?.createdByName.name}`}</p>
                    <p className="max-w-[65%] truncate">{e.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col p-2 h-full overflow-scroll">
        <div className="flex justify-between border-b-2 border-solid border-slate-400 pb-4 mb-2">
          <p className="font-bold text-lg">Nội dung khóa học</p>
          <Link to={replacePathParams(MPath.USER_EDIT_COURSE, { id: String(id) })}>
            <CommonButton>Cài đặt</CommonButton>
          </Link>
        </div>
        <div className="flex flex-col-reverse cursor-pointer ">
          {lessons
            .filter((e) => e.status !== 'Chờ duyệt')
            .map((e) => (
              <div
                key={e.id}
                className={`w-full flex items-center justify-start gap-4 py-4 px-4 rounded-md ${
                  lession === e.id ? 'bg-slate-400' : ''
                }`}
                onClick={() => {
                  setLession(e.id ?? 0);
                  const url = qs.stringifyUrl(
                    {
                      url: location.pathname,
                      query: {
                        lessionId: e.id ?? undefined,
                      },
                    },
                    {
                      skipNull: true,
                    },
                  );
                  navigate(url);
                }}
              >
                <PlayCircleOutlined />
                <p>{e.name}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
