import { CloseCircleOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import authApi from 'axiosConfig/api/auth';
import CommonButton from 'components/CommonButton/CommonButton';
import { saveToken } from 'helpers/localStorage';
import React, { ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import MPath from 'routes/routes';
import { IndexedObject } from 'types/common';
import authStore from 'zustandStore/auth';

type Props = {
  children?: ReactNode;
};

const ModalAuthen = ({ }: Props) => {
  const rootBody = document.querySelector('body');
  const { modalAuth, setModalAuth, saveCurrentUser } = authStore();
  const [form] = Form.useForm()

  const handleSendOtp = async (data) => {
    try {
      await authApi.getOtp(data);
      form.resetFields()
      setPage('otp');
      toast.success('OTP đã gửi đến mail của bạn');
    } catch (err) {
      toast.error('Thông tin email hoặc mật khẩu không chính xác');
    }
  };

  const handleSubmitOtp = async (data: { email: string; otp: string }) => {
    try {
      const res = await authApi.confirmOtp(data);
      const { user, token, refreshToken } = res.data as IndexedObject;
      saveToken('accessToken', token);
      saveToken('refreshToken', refreshToken);
      saveCurrentUser(user);
      // if (parseQuery.uuid) {
      //   navigate(replacePathParams(MPath.USER_COURSE_INTRO, { id: String(parseQuery.courseId) }), {
      //     state: { uuid: parseQuery.uuid },
      //   });
      // } else {
      // navigate(MPath.USER_HOME);
      // }
      form.resetFields()
      setPage('login-form')
      setModalAuth("")
    } catch (err) {
      toast.error('OTP không chính xác');
    }
  };

  const handleRegister = async (data: { email: string; password: string; name: string; phone: string }) => {
    try {
      await authApi.register(data);
      form.resetFields()
      toast.success('Đăng ký thành công');
      setModalAuth("login")
    } catch (err) {
      toast.error('Email đã tồn tại hoặc không chính xác');
    }
  };

  const handleChangePassword = async (data: { oldPassword: string; password: string; rePassword: string }) => {
    try {
      await authApi.changePassword(data)
      form.resetFields()
      toast.success('Đổi mật khẩu thành công');
      setModalAuth("")
    }
    catch (err) {
      toast.error('Mật khẩu không chính xác')
    }
  }

  const handleForgot = async (data: { email: string }) => {
    try {
      await authApi.forgotPassword(data)
      form.resetFields()
      toast.success('Mật khẩu mới đã được gửi đến email của bạn');
      setModalAuth("login")
    } catch (err) {
      toast.error('Email không chính xác')
    }
  }


  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [rePassword, setRePassword] = useState<string>('');

  const [page, setPage] = useState<'login-form' | 'otp'>('login-form');

  const onFinish = async (data: IndexedObject) => {
    console.log(data);
    if (modalAuth === 'login' && page === 'login-form') {
      handleSendOtp(data)
      // setPage('otp');
    }
    if (modalAuth === 'login' && page === 'otp') {
      handleSubmitOtp({
        email: mail,
        otp: otp,
      })
    }
    if (modalAuth === 'register') {
      handleRegister({
        email: mail,
        password: password,
        name: name,
        phone: phone
      })
    }
    if (modalAuth === 'changePassword') {
      handleChangePassword({
        oldPassword: password,
        password: newPassword,
        rePassword: rePassword
      })
    }
    if (modalAuth === 'forgot') {
      handleForgot({
        email: mail,
      })
    }
  };

  if (!modalAuth || !rootBody) return null;
  return ReactDOM.createPortal(
    <div className="fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center">
      <div className="bg-slate-600 opacity-35 absolute top-0 bottom-0 right-0 left-0"></div>
      <div className="relative w-[600px] h-[fit] bg-white z-10 rounded-xl p-8">
        {modalAuth === 'login' && (
          <p className="text-center text-xl font-bold text-yellow-800">Đăng nhập vào E-Course</p>
        )}
        {modalAuth === 'register' && (
          <p className="text-center text-xl font-bold text-yellow-800">
            Đăng ký thành viên E-Course
          </p>
        )}
        {modalAuth === 'changePassword' && (
          <p className="text-center text-xl font-bold text-yellow-800">Đổi mật khẩu</p>
        )}
        {modalAuth === 'forgot' && (
          <p className="text-center text-xl font-bold text-yellow-800">Quên mật khẩu</p>
        )}
        <div className="mt-8">
          <Form name="basic" className="w-full" onFinish={onFinish} form={form}>
            {modalAuth === 'login' && page === 'login-form' && (
              <>
                <span className="font-bold">Email:</span>
                <Form.Item name="email">
                  <Input placeholder="Nhập địa chỉ email" onChange={(e) => setMail(e.target.value)} />
                </Form.Item>
                <span className="font-bold">Mật khẩu:</span>
                <Form.Item name="password">
                  <Input.Password placeholder="Nhập mật khẩu" onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <p className="text-gray-800" onClick={() => setModalAuth('forgot')}>
                  {' '}
                  <strong className="cursor-pointer">
                    Quên mật khẩu
                  </strong>
                </p>
                <p className="text-gray-800 mt-2" onClick={() => setModalAuth('register')}>
                  Bạn chưa có tài khoản? {' '}
                  <strong className="cursor-pointer">
                    Đăng ký
                  </strong>
                </p>
                <CommonButton type="primary" isSubmit={true} className="w-full mt-4">
                  Gửi OTP
                </CommonButton>
              </>
            )}

            {modalAuth === 'login' && page === 'otp' && (
              <>
                <span className="font-bold">OTP:</span>
                <Form.Item name="otp">
                  <Input placeholder="Nhập OTP" onChange={(e) => setOtp(e.target.value)} />
                </Form.Item>
                <p className="text-gray-800" onClick={(e) => handleSendOtp({email: mail, password: password})}>
                  Nếu chưa nhận được OTP. Bấm{' '}
                  <strong className="cursor-pointer">
                    Gửi lại
                  </strong>
                </p>
                <div className="flex gap-12">
                  <CommonButton className="w-full mt-4" onClick={() => setPage('login-form')}>
                    Quay lại
                  </CommonButton>
                  <CommonButton type="primary" isSubmit={true} className="w-full mt-4">
                    Xác nhận
                  </CommonButton>
                </div>
              </>
            )}

            {modalAuth === 'register' && (
              <>
                <span className="font-bold">Email:</span>
                <Form.Item name="email">
                  <Input placeholder="Nhập địa chỉ email của bạn" onChange={(e) => setMail(e.target.value)} />
                </Form.Item>
                <span className="font-bold">Mật khẩu:</span>
                <Form.Item name="password">
                  <Input.Password placeholder="Nhập mật khẩu" onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <span className="font-bold">Tên người dùng:</span>
                <Form.Item name="name">
                  <Input placeholder="Nhập tên của bạn" onChange={(e) => setName(e.target.value)} />
                </Form.Item>
                <span className="font-bold">Số điện thoại:</span>
                <Form.Item name="phone">
                  <Input placeholder="Nhập sđt của bạn" onChange={(e) => setPhone(e.target.value)} />
                </Form.Item>
                <p className="text-gray-800 mt-2" onClick={() => setModalAuth('login' )}>
                  Bạn đã có tài khoản? {' '}
                  <strong className="cursor-pointer">
                    Đăng nhập
                  </strong>
                </p>
                <CommonButton type="primary" className="w-full mt-4" isSubmit={true}>
                  Đăng ký
                </CommonButton>
              </>
            )}

            {modalAuth === 'changePassword' && (
              <>
                <span className="font-bold">Mật khẩu cũ:</span>
                <Form.Item name="password">
                  <Input.Password placeholder="Nhập mật khẩu cũ" onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <span className="font-bold">Mật khẩu mới:</span>
                <Form.Item name="newPassword">
                  <Input.Password placeholder="Nhập mật khẩu mới" onChange={(e) => setNewPassword(e.target.value)} />
                </Form.Item>
                <span className="font-bold">Nhập lại mật khẩu mới:</span>
                <Form.Item name="rePassword">
                  <Input.Password placeholder="Nhập lại mật khẩu mới" onChange={(e) => setRePassword(e.target.value)} />
                </Form.Item>
                <CommonButton type="primary" className="w-full mt-4" isSubmit={true}>
                  Đổi mật khẩu
                </CommonButton>
              </>
            )}
            {modalAuth === 'forgot' && (
              <>
                <span className="font-bold">Email:</span>
                <Form.Item name="password">
                  <Input placeholder="Nhập địa chỉ email của bạn" onChange={(e) => setMail(e.target.value)} />
                </Form.Item>
                <CommonButton type="primary" className="w-full mt-4" isSubmit={true}>
                  Lấy lại mật khẩu
                </CommonButton>
              </>
            )}
          </Form>
        </div>
        <div
          className="absolute top-2 right-4 text-2xl hover:text-red-600 cursor-pointer"
          onClick={() => setModalAuth('')}
        >
          <CloseCircleOutlined />
        </div>
      </div>
    </div>,
    rootBody,
  );
};

export default ModalAuthen;
