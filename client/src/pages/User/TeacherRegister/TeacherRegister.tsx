import { Avatar, Button, List, Radio, RadioChangeEvent, Space, Steps } from 'antd';
import authApi from 'axiosConfig/api/auth';
import userApi from 'axiosConfig/api/user';
import CommonButton from 'components/CommonButton/CommonButton';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MPath from 'routes/routes';
import authStore from 'zustandStore/auth';

const TeacherRegister: React.FC = () => {
  const { currentUser, saveCurrentUser } = authStore();
  const [value, setValue] = useState(1);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'Bước 1/3',
      content: (
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-bold text-2xl">Chia sẻ kiến thức của bạn</p>
            <p className="text-[18px] w-full">
              Các khóa học là những trải nghiệm dựa trên video mang đến cho sinh viên cơ hội học các
              kỹ năng hữu ích. Cho dù bạn có kinh nghiệm giảng dạy hay đây là lần đầu tiên bạn giảng
              dạy, chúng tôi sẽ giúp bạn gói gọn kiến ​​thức của mình vào một khóa học trực tuyến
              nhằm cải thiện cuộc sống của sinh viên.
            </p>
          </div>
          <div className="flex">
            <div>
              <div className="text-[18px] font-bold">
                Bạn đã từng thực hiện phương pháp giảng dạy nào trước đây?
              </div>
              <div className="pl-2 pt-2 pb-3">
                <Radio.Group onChange={onChange} value={value}>
                  <Space direction="vertical">
                    <Radio value={1} className="text-[16px]">
                      Trực tiếp, không chính thức
                    </Radio>
                    <Radio value={2} className="text-[16px]">
                      Trực tiếp, chuyên nghiệp
                    </Radio>
                    <Radio value={3} className="text-[16px]">
                      Trực tuyến
                    </Radio>
                    <Radio value={4} className="text-[16px]">
                      Khác
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Bước 2/3',
      content: (
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-bold text-2xl">Tạo một khóa học</p>
            <p className="text-[18px] w-full">
              Trong những năm qua, chúng tôi đã giúp hàng nghìn người hướng dẫn học cách ghi âm tại
              nhà. Bất kể mức độ kinh nghiệm của bạn là bao nhiêu, bạn cũng có thể trở thành chuyên
              gia video. Chúng tôi sẽ trang bị cho bạn những tài nguyên, mẹo và hỗ trợ mới nhất để
              giúp bạn thành công.
            </p>
          </div>
          <div className="flex">
            <div>
              <div className="text-[18px] font-bold">
                Bạn tạo một video “chuyên nghiệp” đến mức nào?
              </div>
              <div className="pl-2 pt-2 pb-3">
                <Radio.Group onChange={onChange} value={value}>
                  <Space direction="vertical">
                    <Radio value={1} className="text-[16px]">
                      Tôi là người mới bắt đầu
                    </Radio>
                    <Radio value={2} className="text-[16px]">
                      Tôi có một số kiến ​​thức
                    </Radio>
                    <Radio value={3} className="text-[16px]">
                      Tôi có kinh nghiệm
                    </Radio>
                    <Radio value={4} className="text-[16px]">
                      Tôi có sẵn video để tải lên
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Bước 3/3',
      content: (
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="font-bold text-2xl">Mở rộng phạm vi tiếp cận của bạn</p>
            <p className="text-[18px] w-full">
              Sau khi xuất bản khóa học của mình, bạn có thể tăng lượng khán giả là sinh viên của
              mình và tạo ảnh hưởng với sự hỗ trợ từ các chương trình khuyến mãi trên thị trường
              cũng như thông qua các nỗ lực tiếp thị của riêng bạn. Cùng nhau, chúng tôi sẽ giúp
              những sinh viên phù hợp khám phá khóa học của bạn
            </p>
          </div>
          <div className="flex">
            <div>
              <div className="text-[18px] font-bold">
                Bạn có học viên để chia sẻ khóa học của mình không?
              </div>
              <div className="pl-2 pt-2 pb-3">
                <Radio.Group onChange={onChange} value={value}>
                  <Space direction="vertical">
                    <Radio value={1} className="text-[16px]">
                      Không phải lúc này
                    </Radio>
                    <Radio value={2} className="text-[16px]">
                      Tôi có một lượng nhỏ người theo dõi
                    </Radio>
                    <Radio value={3} className="text-[16px]">
                      Tôi có một lượng lớn người theo dõi
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const getCurrentUser = async () => {
    const res = await authApi.getCurrentUser();
    const { me, listCourse } = res.data;
    saveCurrentUser({ ...me, listCourse });
  };

  const handleRegisTeacher = async () => {
    const res = await userApi.registerTeacher();
    console.log(res.data);
    // saveCurrentUser(res.data);
    await getCurrentUser()
    navigate(MPath.USER_HOME);
  };

  const handleCancelRegisTeacher = async () => {
    navigate(MPath.USER_HOME);
  };

  return (
    <div className="w-full h-[100%] flex flex-col item-start overflow-hidden p-4">
      <h2 className="font-bold text-2xl text-center mb-4">Đăng ký trở thành giáo viên</h2>
      <Steps current={current} items={items} />
      <div className="border-[1px]- border-dashed rounded-xl mt-4 bg-emerald-50 ">
        {steps[current].content}
      </div>
      <div style={{ marginTop: 24 }}>
        <div className="flex">
          <div className="grow">
            {current > 0 && <CommonButton onClick={() => prev()}>Trước</CommonButton>}
          </div>
          <div>
            {current < steps.length - 1 && (
              <CommonButton type="primary" onClick={() => next()}>
                Tiếp
              </CommonButton>
            )}
            {current === steps.length - 1 && (
              <div className='flex gap-2'>
                <Button danger onClick={handleCancelRegisTeacher}>
                  Hủy
                </Button>
                <CommonButton type="primary" onClick={handleRegisTeacher}>
                  Hoàn Thành
                </CommonButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
