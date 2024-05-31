import { Table, TableProps } from 'antd';
import Search from 'antd/es/input/Search';
import userApi from 'axiosConfig/api/user';
import CommonButton from 'components/CommonButton/CommonButton';
import { replacePathParams } from 'helpers/functions';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MPath from 'routes/routes';
import { TUser } from 'types/user';

const ListUser: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');

  const listUser = async (search: string) => {
    const res = await userApi.findAllUser();
    const filter = res.data.filter((e) => e.name?.toLowerCase().includes(search.toLowerCase()));
    setUsers(filter);
  };
  useEffect(() => {
    listUser(search);
  }, [search]);

  const [users, setUsers] = useState<TUser[]>([]);
  const columns: TableProps<any>['columns'] = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: '15%',
    },
    {
      title: 'Giáo viên',
      dataIndex: 'teacher',
      key: 'teacher',
      width: '15%',
      render: (teacher: boolean) => (teacher ? 'Giáo viên' : 'Học sinh'),
    },
    {
      title: 'Học phí',
      dataIndex: 'tuitionFees',
      key: 'tuitionFees',
      width: '15%',
      render: (value: number | null | undefined) => (value != null ? value.toLocaleString() : ''),
    },
    // {
    //     title: 'Hoa hồng',
    //     dataIndex: 'commission',
    //     key: 'commission',
    //     width: '15%',
    //     render: (value: number | null | undefined) => value != null ? value.toLocaleString() : '',
    // },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <CommonButton
          type="primary"
          onClick={() => {
            navigate(replacePathParams(MPath.USER_REFERRAL_ID, { id: record.id }));
          }}
        >
          Chi tiết hoa hồng
        </CommonButton>
      ),
    },
  ];

  return (
    <div className="w-full h-[100%] flex flex-col item-start overflow-scroll p-4">
      <h2 className="text-center font-bold text-xl">Danh sách người dùng</h2>
      <Search className="my-4" placeholder="Tìm kiếm" onChange={(e) => setSearch(e.target.value)} />
      <Table columns={columns} dataSource={users} pagination={false} />
    </div>
  );
};

export default ListUser;
