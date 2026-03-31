import { UserOutlined  } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, message, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAccount } from '../../actions/login';
import { useEffect, useState } from 'react';
import './Profile.scss';
function Profile() {

  const isLogin = useSelector(state => state.loginReducer);
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const id = sessionStorage.getItem("id");
  // Trạng thái điều khiển hiển thị Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openChangepass, setOpenChangePass] = useState(false);
  // Trạng thái điều khiển chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [formInfo] = Form.useForm();
  const [formPassword] = Form.useForm();

  const patchPassword = async (e) => {
    console.log(e);
    const response = await fetch(`/users/user/change/password?id=${id}&oldPassword=${e.oldPassword}&newPassword=${e.newPassword}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json();
  }

  const handleLogin = () => {
    navigate('/login');
  }
  const handleRegister  = () => {
    navigate('/register');
  }
  const handleLogOut = () => {
    sessionStorage.clear();
    navigate('/');
    dispatch(logoutAccount());
    message.success('Đăng xuất thành công!');
  }
  const handleHistory = () => {
    navigate('/history');
  }

  const handleChangePass = () => {
    setOpenChangePass(true)
  }

  const handleOk = (e) => {
    console.log(e);
  }

  const handleSubmitPass = async (e) => {
    if(e.newPassword !== e.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
    }
    else {
      const response = await patchPassword(e);
      console.log(response);
      if(response) {
        message.success('Đổi mật khẩu thành công!');
        setOpenChangePass(false);
        formPassword.resetFields();
      }
      else {
        message.error('Đổi mật khẩu thất bại!');
      }
    }
  }

  const getUser = async () => {
    const response = await fetch(`/users/user/me?id=${id}`);
    const data = await response.json();
    setUser(data.data);
    return data.data;
  }

  const patchUser = async (user_new) => {
    console.log(user_new)
    const response = await fetch(`/users/user/change/information?id=${user_new.id}&phone=${user_new.phone}&address=${user_new.address}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json();
  }

  useEffect(() => {
    if(isLogin || token){
      getUser(token);
    }
  }, [isLogin]);


  const items = isLogin || token ? [
    {
      key: '2',
      label: <Button className="add-find-product" onClick={() => {showModal()}}>Thông tin tài khoản</Button>
    },
    {
      key: '3',
      label: <Button className="add-find-product" onClick={handleHistory}>Lịch sử mua hàng</Button>
    },
    {
      key: '4',
      label: <Button className="add-find-product" onClick={handleChangePass}>Đổi mật khẩu</Button>
    },
    {
      key: '5',
      label: <Button className="add-find-product" onClick={handleLogOut}>Đăng xuất</Button>
    }
  ] : [
    {
      key: '6',
      label: <Button className="add-find-product" onClick={handleLogin}>Đăng nhập</Button>
    },
    {
      key: '7',
      label: <Button className="add-find-product" onClick={handleRegister}>Đăng ký</Button>
    }
  ]

  const showModal = () => {
    setIsModalVisible(true);
  };

  // Đóng Modal và tắt chế độ chỉnh sửa
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setOpenChangePass(false);
    formInfo.resetFields();
    formPassword.resetFields();
  };

  // Chuyển chế độ sang chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Xử lý lưu thông tin
  const handleSubmit = async (e) => {
    // Gửi dữ liệu đến API hoặc xử lý lưu trữ tại đây
    // Giả sử lưu thành công, hiển thị thông báo
    message.success('Thông tin tài khoản đã được cập nhật!');
    setIsEditing(false); // Tắt chế độ chỉnh sửa sau khi lưu

    const new_user = {
      id: id,
      phone: e.phone,
      address: e.address
    }
    await patchUser(new_user);
    setIsModalVisible(false);
  };

  return (
    <div className="profile">
      <Dropdown menu={{ items }} placement="bottomRight" arrow>
        <Button><UserOutlined /></Button>
      </Dropdown>
      <Modal
        title="Thông tin tài khoản"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={user} form={formInfo}>
          <Form.Item label="Họ tên" name="fullName">
            <Input
              disabled={!isEditing} // Khóa chỉnh sửa khi không ở chế độ chỉnh sửa
              style={{fontWeight: 'bold'}}
              className=' information'
            />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input
              disabled={!isEditing}
              style={{fontWeight: 'bold'}}
              className=' information'
            />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input
              disabled={!isEditing}
              style={{fontWeight: 'bold'}}
              className=' information'
            />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input
              disabled={!isEditing}
              style={{fontWeight: 'bold'}}
              className=' information'
            />
          </Form.Item>
          <Form.Item>
            {
              isEditing ? (
                <Button className = "changeColorButton" key="save" type="primary" htmlType='submit'>
                  Lưu
                </Button>
              ) : (
                <Button className = "changeColorButton" key="edit" type="primary" onClick={handleEdit}>
                  Cập nhật thông tin
                </Button>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Đổi mật khẩu"
        visible={openChangepass}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        footer={false}
      >
        <Form
          form={formPassword}
          layout="vertical"
          name="change_password"
          onFinish={handleSubmitPass}
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password className='' placeholder="Nhập mật khẩu cũ" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            ]}
          >
            <Input.Password className='' placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            ]}
          >
            <Input.Password className='' placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>Đổi mật khẩu</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default Profile;