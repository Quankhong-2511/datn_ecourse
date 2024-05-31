import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Carousel, Col, Divider, Pagination, Row, theme } from 'antd';
import Meta from 'antd/es/card/Meta';
import courseApi from 'axiosConfig/api/course';
import CommonButton from 'components/CommonButton/CommonButton';
import { replacePathParams } from 'helpers/functions';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MPath from 'routes/routes';
import authStore from 'zustandStore/auth';
import courseStore from 'zustandStore/course';

type Props = {};

const style: React.CSSProperties = { padding: '8px 0', fontSize: '18px' };

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '527px',
  color: '#fff',
  lineHeight: '527px',
  textAlign: 'center',
  background: '#364d79',
};

const TeacherCourse = (props: Props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { currentUser } = authStore();
  const navigate = useNavigate();

  const { listMyCourses, keyword, getListMyCourses } = courseStore();

  useEffect(() => {
    getListMyCourses({ keyword, role: 1 });
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      <h2 className="font-bold text-xl mt-4">Khóa học đang bán</h2>
      <div className="w-full flex flex-col flex-1 overflow-scroll">
        <div
          style={{
            background: colorBgContainer,
            padding: 24,
            borderRadius: borderRadiusLG,
            marginBottom: 80,
          }}
        >
          <Row gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }}>
            {listMyCourses.map((e, i) => (
              <Col className="gutter-row py-4" span={6}>
                <Link to={replacePathParams(MPath.USER_COURSE_DETAIL, { id: String(e.courseId) })}>
                  <Card
                    hoverable={true}
                    className="cursor-pointer"
                    cover={
                      <img
                        alt="example"
                        className="max-h-[150px] h-[150px] object-cover"
                        src={
                          e.course?.file && e.course?.file[0]
                            ? e.course?.file[0]?.path
                            : 'https://as1.ftcdn.net/v2/jpg/02/68/55/60/1000_F_268556011_PlbhKss0alfFmzNuqXdE3L0OfkHQ1rHH.jpg'
                        }
                      />
                    }
                  >
                    <Meta title={e.course?.name ?? 'No name'} description={<></>} />
                    <div className="min-h-[140px]">
                      <div className="flex items-center gap-2">
                        <UserOutlined />
                        <p className="text-cyan-400">{e.user?.name}</p>
                      </div>
                      <p className="truncate line-clamp-3 text-pretty mt-2">{e.course?.content}</p>
                      <div className="mt-4 font-bold text-blue-600 underline">Xem chi tiết</div>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourse;
