import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Input, Modal, Pagination, Row, theme } from 'antd';
import Meta from 'antd/es/card/Meta';
import useEmblaCarousel from 'embla-carousel-react';
import { getPublicUrl, replacePathParams } from 'helpers/functions';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MPath from 'routes/routes';
import authStore from 'zustandStore/auth';
import courseStore from 'zustandStore/course';
import { TCourses } from 'types/course';
import TextArea from 'antd/es/input/TextArea';

type Props = {};

const style: React.CSSProperties = { padding: '8px 0', fontSize: '18px' };

const HomeUser = (props: Props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 25 });
  const { currentUser, setModalAuth } = authStore();
  const navigate = useNavigate();

  const { listCategory, listCourses, totalHome, getListCourses } = courseStore();

  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<number>(0);

  const [dataEdit, setDataEdit] = useState<{
    name: string;
    content: string;
  }>({
    name: '',
    content: '',
  });

  useEffect(() => {
    getListCourses({ page, ...(!!category ? { categoryId: category } : {}) });
  }, [page, category]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      <div className="w-full flex flex-col flex-1 overflow-scroll">
        {/* Carousel */}
        <div className="embla h-[200px] overflow-x-hidden" ref={emblaRef}>
          <div className="embla__container h-full">
            <div className="embla__slide p-2">
              <div className="w-full h-full border-2 border-solid border-blue-200 rounded-lg p-2">
                <img
                  src="https://gorzelinski.com/static/1db41e3ecd311724a15306b270d99dd9/6e87d/next-js-logo.png"
                  alt="Next JS"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="embla__slide p-2">
              <div className="w-full h-full border-2 border-solid border-blue-200 rounded-lg p-2">
                <img
                  src="https://assets-global.website-files.com/6475e932162b5cc05de9cbd3/64786fe35746415505c4645c_47.png"
                  alt="Next JS"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: colorBgContainer,
            padding: 12,
            borderRadius: borderRadiusLG,
            marginTop: 40,
          }}
        >
          <Divider orientation="center">
            <div className="flex gap-7 text-[18px]">
              <div
                className={`border-2 border-solid border-slate-500 rounded-md py-2 px-4  cursor-pointer bg-orange-100 text-black`}
                onClick={() => setCategory(0)}
              >
                Tất cả
              </div>
              {listCategory
                .map((e) => (
                  <div
                    className={`border-2 border-solid border-slate-500 rounded-md py-2 px-4  cursor-pointer ${
                      category === e.id ? 'bg-slate-100 text-black' : 'bg-slate-600 text-white'
                    }`}
                    onClick={() => setCategory(e.id ?? 0)}
                  >
                    {e.title}
                  </div>
                ))
                .slice(0, 5)}
            </div>
          </Divider>
          <Row gutter={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
            {listCourses.map((e: TCourses, i) => (
              <Col className="gutter-row py-2" span={6}>
                <div
                  onClick={() => {
                    if (!currentUser.id) {
                      setModalAuth('login');
                      return;
                    }
                    navigate(replacePathParams(MPath.USER_COURSE_INTRO, { id: String(e.id) }));
                  }}
                >
                  <Card
                    hoverable={true}
                    className="cursor-pointer"
                    cover={
                      <img
                        alt="example"
                        className="max-h-[150px] h-[150px] object-cover"
                        src={
                          e.file && e.file[0]
                            ? e.file[0]?.path
                            : 'https://as1.ftcdn.net/v2/jpg/02/68/55/60/1000_F_268556011_PlbhKss0alfFmzNuqXdE3L0OfkHQ1rHH.jpg'
                        }
                      />
                    }
                  >
                    <Meta title={e.name ?? 'Khoa hoc abcxzyzasdfsdfsd'} description={<></>} />
                    <div className="min-h-[140px]">
                      <div className="flex items-center gap-2">
                        <UserOutlined />
                        <p className="text-cyan-400">{e.user?.name}</p>
                      </div>
                      <p className="truncate line-clamp-3 text-pretty mt-2">{e.content}</p>
                      {currentUser.listCourse?.includes(e.id ?? 0) ? (
                        <div className="mt-4 font-bold text-blue-600 underline">Tiếp tục học</div>
                      ) : (
                        <div className="flex items-center mt-4 gap-6">
                          <p className="font-bold text-xl ">{`đ${(
                            e.lastPrice ?? 0
                          ).toLocaleString()}`}</p>
                          {!!e.discount && (
                            <p className="text-sm line-through">{`đ${(
                              e.price ?? 0
                            ).toLocaleString()}`}</p>
                          )}
                        </div>
                      )}
                      {!currentUser.listCourse?.includes(e.id ?? 0) && !!e.discount && (
                        <div className="text-white italic ml-auto bg-red-600 w-fit px-4 py-2 rounded-xl font-bold">
                          Giảm {e.discount ?? 1} %
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
          <Pagination
            className="text-center"
            current={page}
            defaultCurrent={1}
            total={totalHome}
            onChange={(e) => setPage(e)}
          />
        </div>

        <div
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginBottom: 40,
            gap: 30,
          }}
        >
          {!currentUser.teacher && currentUser.id && currentUser?.role?.id === 2 && (
            <Row className="w-[50%] ml-[25%]">
              <Col span={12}>
                <div style={style}>
                  <div>
                    <img
                      src="https://clickboxagency.com/images-new/services/php-development-service-new-jersey/184.webp"
                      alt="Tên ảnh"
                      className="w-full"
                    />
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="h-full flex flex-col gap-2">
                  <div className="text-[30px] font-bold">Trở thành giáo viên</div>
                  <div className="text-[18px]">
                    Giáo viên từ khắp nơi đang dạy hàng ngàn học viên. Chúng tôi cung cấp các công
                    cụ và kỹ năng để bạn có thể chia sẻ những gì bạn đam mê.
                  </div>
                  <button className="text-[18px] bg-black text-white w-fit py-2 px-4 rounded-xl">
                    <Link to={MPath.USER_TEACHER_REGISTER}>Đăng ký dạy</Link>
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </div>
        <footer className="h-[200px] w-full bg-slate-800 flex items-center justify-between px-12 py-4">
          <div className="flex gap-4 items-center">
            <img
              className="w-[100px] h-[100px] rounded-[50%]"
              src={getPublicUrl('logobrand.png')}
              alt=""
            />
            <span className="text-white font-bold text-xl">E-Course</span>
          </div>
          <div className="flex flex-col">
            {Array(3)
              .fill(null)
              .map((e, i) => (
                <img key={i} src="" alt="" />
              ))}
          </div>
          <div className="flex items-center gap-8">
            {Array(3)
              .fill(null)
              .map((e, i) => (
                <div key={i} className="flex flex-col text-white font-bold text-sm gap-2"></div>
              ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomeUser;
