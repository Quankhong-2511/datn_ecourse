import {
  BellOutlined,
  MedicineBoxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Input, Layout, Menu, MenuProps, Select } from 'antd';
import courseApi from 'axiosConfig/api/course';
import CommonButton from 'components/CommonButton/CommonButton';
import NotiWrap from 'components/NotiWrap/NotiWrap';
import { getPublicUrl, replacePathParams } from 'helpers/functions';
import { getTokenFromLocalStorage } from 'helpers/localStorage';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MPath from 'routes/routes';
import courseStore from 'zustandStore/course';
import './DefaultLayout.scss';
import useService from './service';
import qs from 'query-string';
import ModalAuthen from 'components/ModalAuthen/ModalAuthen';
import authStore from 'zustandStore/auth';
import notiApi from 'axiosConfig/api/noti';
import notiStore from 'zustandStore/noti';

const { Header, Sider, Content } = Layout;

type Props = {
  children: JSX.Element;
};
const DefaultLayout: React.FC<Props> = ({ children }) => {
  const { onLogout, currentUser } = useService();
  const { setModalAuth } = authStore();
  const { saveListCategory, setKeyword, listCategory, saveCategory, category, keyword } =
    courseStore();
  const { getNotis, listNoti } = notiStore();
  const [modal, setModal] = useState<'user' | 'change-pass' | ''>('');
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <p style={{ padding: '3px' }} onClick={() => navigate(MPath.USER_PROFILE)}>
          Thông tin cá nhân
        </p>
      ),
    },
    {
      key: '2',
      label: (
        <p
          style={{ padding: '3px' }}
          onClick={() => {
            setModalAuth('changePassword');
          }}
        >
          Đổi mật khẩu
        </p>
      ),
    },
    {
      key: '3',
      label: (
        <p style={{ padding: '3px' }} onClick={onLogout}>
          Đăng xuất
        </p>
      ),
    },
  ];

  const listSubnavUser = [
    {
      id: 3,
      icon: MedicineBoxOutlined,
      hidden: currentUser?.role?.id === 1 || !currentUser.id,
      label: <Link to={MPath.USER_MY_COURSE}>Khóa học đã mua</Link>,
    },
    {
      id: 4,
      icon: MedicineBoxOutlined,
      hidden: !currentUser.teacher || currentUser?.role?.id === 1,
      label: <Link to={MPath.USER_TEACHER_COURSE}>Khóa học đang bán</Link>,
    },
    {
      id: 5,
      icon: MedicineBoxOutlined,
      hidden: !currentUser.teacher || currentUser?.role?.id === 1,
      label: (
        <Link to={replacePathParams(MPath.USER_EDIT_COURSE, { id: 'create' })}>Tạo khóa học</Link>
      ),
    },

    {
      id: 6,
      icon: MedicineBoxOutlined,
      hidden: currentUser.role?.id === 2 || !currentUser.id,
      label: <Link to={MPath.ADMIN_COURSE}>Bài học cần duyệt</Link>,
    },
    {
      id: 7,
      icon: MedicineBoxOutlined,
      hidden: currentUser.role?.id === 2 || !currentUser.id,
      label: <Link to={MPath.ADMIN_USER}>Người dùng</Link>,
    },
    {
      id: 8,
      icon: MedicineBoxOutlined,
      hidden: currentUser.role?.id === 1 || !currentUser.id,
      label: <Link to={MPath.USER_REFERRAL}>Danh sách mời</Link>,
    },
    // {
    //   id: 9,
    //   icon: MedicineBoxOutlined,
    //   hidden: currentUser.role?.id === 2 || !currentUser.id,
    //   label: <Link to={MPath.ADMIN_SETTING}>Cấp bậc hoa hồng</Link>,
    // },
  ];

  const itemsUser: MenuProps['items'] = listSubnavUser
    .filter((e) => !e.hidden)
    .map((list, index) => {
      const key = String(index + 1);

      return {
        key: `sub${key}`,
        icon: React.createElement(list.icon),
        label: list.label,
      };
    });

  const [collapsed, setCollapsed] = useState(false);

  const { Search } = Input;

  const token = getTokenFromLocalStorage();

  const checkAuth = !!Object.keys(currentUser).length || token;

  const getCategory = async () => {
    const res = await courseApi.getCategory();
    saveListCategory(res.data);
  };
  const handleChange = (e) => {
    saveCategory(e);
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getNotis();
  }, []);

  const Option = Select.Option;

  return (
    <Layout className="w-[100%] h-[100vh]">
      <ModalAuthen />
      <Sider className="w-[100%]" trigger={null} collapsible collapsed={collapsed}>
        <Link to={MPath.USER_HOME}>
          <div className="w-[100%] h-[65px] bg-[#4d5c6a] flex justify-center items-center py-2">
            <img
              className="w-[60px] h-[60px] rounded-[50%]"
              src={getPublicUrl('logobrand.png')}
              alt=""
            />
          </div>
        </Link>
        <Menu theme="dark" mode="inline" style={{ borderRight: 0 }} items={itemsUser} />
      </Sider>
      <Layout className="site-layout default-layout-body">
        <Header className="header site-layout-background" style={{ padding: 20 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          <div className="md:w-[50%] lg:w-[60%] flex items-center gap-8">
            <Select defaultValue={'Tất cả'} style={{ width: 320 }} onChange={handleChange}>
              {[{ id: '', title: 'Tất cả' }, ...listCategory].map((e) => (
                <Option id={e.id} value={e.id}>
                  {e.title}
                </Option>
              ))}
            </Select>
            <Search
              placeholder="Tìm kiếm khóa học"
              className="w-[300] "
              enterButton
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              onSearch={(e) => {
                navigate(`${MPath.USER_COURSE_SORT}`);
              }}
            />
          </div>
          {checkAuth ? (
            <div className="logo-user">
              <Dropdown
                getPopupContainer={() => {
                  return document.body;
                }}
                overlayStyle={{
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                }}
                placement="bottomRight"
                trigger={['click']}
                menu={{ items }}
                dropdownRender={() => (
                  <>
                    <NotiWrap />
                  </>
                )}
              >
                <div className="logo-bell">
                  <Badge dot={listNoti.filter((e) => e.status && e.status[0] === 0).length > 0}>
                    <BellOutlined className="bell" />
                  </Badge>
                </div>
              </Dropdown>
              {!currentUser.teacher && currentUser.id && currentUser?.role?.id === 2 && (
                <Link to={MPath.USER_TEACHER_REGISTER} className="mr-4">
                  <CommonButton>Trở thành giáo viên</CommonButton>
                </Link>
              )}
              <div className="">
                <span className="mr-4">{currentUser.name}</span>
                <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']}>
                  <Avatar
                    src={currentUser.file && currentUser.file[0] ? currentUser.file[0]?.path : ''}
                    size={'large'}
                    className="cursor-pointer"
                  />
                </Dropdown>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setModalAuth('login');
                }}
              >
                Đăng nhập
              </Button>
              <Button
                onClick={() => {
                  setModalAuth('register');
                }}
              >
                Đăng ký
              </Button>
            </div>
          )}
        </Header>
        <Content className="site-layout-background m-2 p-2 overflow-hidden">
          <div className="default-layout-content h-full">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
