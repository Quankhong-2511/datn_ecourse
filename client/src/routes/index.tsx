import React from 'react';
import Notfound from '../pages/Notfound';
import MPath from './routes';
import { ERole } from 'enums';
import HomeUser from 'pages/User/HomeUser/HomeUser';
import CourseDetail from 'pages/User/CourseDetail/CourseDetail';
import Profile from 'pages/User/Profile/Profile';
import TeacherRegister from 'pages/User/TeacherRegister/TeacherRegister';
import CourseEdit from 'pages/User/CourseEdit/CourseEdit';
import LessonList from 'pages/User/LessonList/LessonList';
import CourseIntroduce from 'pages/User/CourseIntroduce/CourseIntroduce';
import MyCourse from 'pages/User/MyCourse/MyCourse';
import TeacherCourse from 'pages/User/TeacherCourse/TeacherCourse';
import CourseSort from 'pages/User/CourseSort/CourseSort';
import CourseAccept from 'pages/Admin/CourseAccept/CourseAccept';
import LessonAccept from 'pages/Admin/LessonAccept/LessonAccept';
import ListUser from 'pages/Admin/ListUser/ListUser';
import Referral from 'pages/User/Referral/Referral';
import Settings from 'pages/Admin/Settings/Settings';

export const routers: any = [
  // User ---------------------------------------------------------------
  {
    name: 'USER_HOME',
    element: <HomeUser />,
    public: false,
    path: MPath.USER_HOME,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_COURSE_SORT',
    element: <CourseSort />,
    public: false,
    path: MPath.USER_COURSE_SORT,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_COURSE_DETAIL',
    element: <CourseDetail />,
    public: false,
    path: MPath.USER_COURSE_DETAIL,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_PROFILE',
    element: <Profile />,
    public: false,
    path: MPath.USER_PROFILE,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_TEACHER_REGISTER',
    element: <TeacherRegister />,
    public: false,
    path: MPath.USER_TEACHER_REGISTER,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_EDIT_COURSE',
    element: <CourseEdit />,
    public: false,
    path: MPath.USER_EDIT_COURSE,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_COURSE_INTRO',
    element: <CourseIntroduce />,
    public: false,
    path: MPath.USER_COURSE_INTRO,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_COURSE_LESSONS',
    element: <LessonList />,
    public: false,
    path: MPath.USER_COURSE_LESSONS,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_MY_COURSE',
    element: <MyCourse />,
    public: false,
    path: MPath.USER_MY_COURSE,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_TEACHER_COURSE',
    element: <TeacherCourse />,
    public: false,
    path: MPath.USER_TEACHER_COURSE,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_REFERRAL',
    element: <Referral />,
    public: false,
    path: MPath.USER_REFERRAL,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'USER_REFERRAL_ID',
    element: <Referral />,
    public: false,
    path: MPath.USER_REFERRAL_ID,
    role: [ERole.User],
    exact: true,
  },
  // Admin
  {
    name: 'ADMIN_COURSE',
    element: <CourseAccept />,
    public: false,
    path: MPath.ADMIN_COURSE,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'ADMIN_LESSON',
    element: <LessonAccept />,
    public: false,
    path: MPath.ADMIN_LESSON,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'ADMIN_USER',
    element: <ListUser />,
    public: false,
    path: MPath.ADMIN_USER,
    role: [ERole.User],
    exact: true,
  },
  {
    name: 'ADMIN_SETTING',
    element: <Settings />,
    public: false,
    path: MPath.ADMIN_SETTING,
    role: [ERole.User],
    exact: true,
  },
  // Not found
  {
    name: 'Notfound',
    element: <Notfound />,
    public: true,
    path: '/notfound',
    role: [ERole.User, ERole.Admin],
    exact: true,
  },
];
