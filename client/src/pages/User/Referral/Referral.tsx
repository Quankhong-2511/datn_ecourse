import { Tree } from 'antd';
import courseApi from 'axiosConfig/api/course';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Referral: React.FC = () => {
  const [treeData, setTreeData] = useState<any>([]);

  const { id } = useParams();

  const mapRecurse = (arr: any) => {
    if (arr.length === 0) return [];
    return arr.map((e) => {
      return {
        ...e,
        title: (
          <>
            {e.user?.name && (
              <div className="flex items-center justify-center gap-3">
                <span className="bg-red-400 text-white py-1 px-2 rounded-md">Lv {e.level}</span>
                <span className="font-bold text-base rounded-md">{e.user.name}</span>
                <span className="font-bold text-base rounded-md ml-8">
                  Hoa hồng nhận được {e.commission.toLocaleString()}
                </span>
                <span className="font-bold text-base rounded-md ml-8">
                  Ngày mời thành công {e.createdAt}
                </span>
              </div>
            )}
          </>
        ),
        children: mapRecurse(e.children),
      };
    });
  };

  useEffect(() => {
    const getLevel = async () => {
      const res = await courseApi.getLevel(id ?? '');
      const data = res.data.map((e) => {
        return {
          ...e,
          title: (
            <>
              <span className="bg-blue-500 font-bold text-base text-white py-1 px-4 rounded-md">
                Khóa học: {e.title}
              </span>
              <span className="bg-blue-500 font-bold text-base text-white py-1 px-4 rounded-md ml-2">
                Học phí: {e.price.toLocaleString()}
              </span>
            </>
          ),
          children: mapRecurse(e.children),
        };
      });
      setTreeData(data);
    };
    getLevel();
  }, []);

  return (
    <div className="w-full h-[100%] flex flex-col item-start overflow-hidden">
      <p className="text-xl font-bold text-center mt-4">Danh sách người giới thiệu</p>
      <Tree showLine={true} defaultExpandedKeys={['0-0-0']} treeData={treeData} />
    </div>
  );
};

export default Referral;
