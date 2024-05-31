import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { List } from 'antd';
import courseApi from 'axiosConfig/api/course';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndexedObject } from 'types/common';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [setting, setSetting] = useState<IndexedObject[]>([]);
  const inputRef = useRef<any>(null);
  const [edit, setEdit] = useState<string>('');
  const getSettings = async () => {
    const res = await courseApi.getCommission();
    console.log(res.data);
    const dataCommission: any = [];
    Object.entries(res.data).forEach((e) => {
      if (e[0].includes('level')) {
        dataCommission.push({
          [`${e[0]}`]: e[1],
          title: `Level ${e[0]?.split('_')[1]}`,
          value: e[1],
        });
      }
    });
    setSetting(dataCommission);
  };
  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div className="w-full h-[100%] flex flex-col item-start overflow-scroll p-4">
      <h2 className="text-center font-bold text-xl">Cài đặt</h2>

      <div className="flex flex-col">
        <List
          itemLayout="horizontal"
          dataSource={setting}
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
                          //   if (edit) {
                          //     handleUpdateUser(edit, inputRef.current.value);
                          //     setEdit('');
                          //   } else {
                          //     setEdit(item.key ?? '');
                          //   }
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

export default Settings;
