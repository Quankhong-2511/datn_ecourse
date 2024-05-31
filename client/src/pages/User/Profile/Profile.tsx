import { CameraOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';
import uploadApi from 'axiosConfig/api/upload';
import userApi from 'axiosConfig/api/user';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import authStore from 'zustandStore/auth';

const Profile: React.FC = () => {
  const { currentUser, saveCurrentUser } = authStore();

  const handleUpdateUser = async (key: string, value: string) => {
    const res = await userApi.updateUser({ [key]: value }, currentUser.id ?? 0);
    console.log(res.data);
    saveCurrentUser({ ...currentUser, [key]: res.data.data[key] });
  };
  const data = [
    {
      title: 'Tên hiển thị',
      value: currentUser.name,
      key: 'name',
    },
    {
      title: 'Email',
      value: currentUser.email,
    },
    {
      title: 'Số điện thoại',
      value: currentUser.phone,
      key: 'phone',
    },
    {
      title: 'Tiền học',
      value: currentUser.tuitionFees ?? 0,
    },
    // {
    //   title: 'Hoa hồng',
    //   value: currentUser.commission ?? 0,
    // },
    // {
    //   title: 'Số tiền nạp chờ xác nhận',
    //   value: currentUser.extraMoney ?? 0,
    //   key: 'extraMoney',
    // },
    // {
    //   title: 'Số dư còn lại',
    //   value: currentUser.availableBalances ?? 0,
    // },

  ];

  const handleUpload = async (e) => {
    const typeFile = e.target.files[0].type as string;
    if (!typeFile.includes('png') && !typeFile.includes('jp')) {
      toast.error('Vui lòng upload file đúng định dạng image');
      return;
    }
    const file = e.target.files[0];
    const form = new FormData();
    form.append('file', file);
    const res = await uploadApi.upload(form);
    const fileData = (res.data as any).data[0];
    const updateRes = await userApi.updateUser({ file: [fileData.path] }, currentUser.id ?? 0);
    saveCurrentUser({ ...currentUser, file: updateRes.data?.data?.file });
  };

  const inputRef = useRef<any>(null);
  const uploadRef = useRef<any>(null);
  const [edit, setEdit] = useState<string>('');
  return (
    <div className="w-full h-[100%] flex flex-col item-start overflow-hidden">
      <div className="bg-emerald-200 w-full h-[120px] relative">
        <img
          className="rounded-[50%] w-[140px] h-[140px] absolute bottom-0 object-cover left-[50%] translate-x-[-50%]  translate-y-[30%]"
          src={currentUser.file && currentUser.file[0] ? currentUser.file[0].path : ''}
          alt=""
        />
        <div
          onClick={() => uploadRef.current.click()}
          className="w-[50px] h-[50px] rounded-[50%] cursor-pointer bg-slate-300 absolute bottom-0  left-[50%] translate-x-[150%]  translate-y-[40%] flex items-center justify-center"
        >
          <CameraOutlined />
        </div>
        <input ref={uploadRef} type="file" className="hidden" onChange={handleUpload} />
      </div>
      <div className="mt-12 px-4">
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={<p className="font-bold">{item.title}</p>}
                description={
                  <div className="flex items-center gap-6">
                    {edit === item.key ? (
                      <input defaultValue={item.value} ref={inputRef} />
                    ) : (
                      <span>{item.value}</span>
                    )}
                    {item.key && (
                      <div
                        className="flex items-center justify-center p-4 cursor-pointer hover:bg-slate-200 rounded-md"
                        onClick={() => {
                          if (edit) {
                            handleUpdateUser(edit, inputRef.current.value);
                            setEdit('');
                          } else {
                            setEdit(item.key ?? '');
                          }
                        }}
                      >
                        {edit === item.key ? <SaveOutlined /> : <EditOutlined />}
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Profile;
