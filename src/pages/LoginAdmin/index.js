import { Button, Form, Input, notification } from "antd";
import './Login.scss';
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginAccount } from "../../actions/login";

function LoginAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Nếu đã đăng nhập với role admin → skip form, vào thẳng dashboard
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  if (token && role === 'admin') {
    return <Navigate to="/admin/manage-shop" replace />;
  }

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description, type) => {
    api[type]({
      message: <h3 style={{margin: "0", padding: "0"}}>{message}</h3>,
      description: description,
      duration: 1,
    });
  };

  const checkInfomation = async (email, password) => {
    const response = await fetch(`/api/signin?email=${email}&password=${password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data.data;
  }

  const handleSubmit = async (e) => {
    sessionStorage.clear();
    const response = await checkInfomation(e.email, e.password);
    console.log(response);
    if(response){
      if(response.role === 'Admin'){
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('id', response.id);
        sessionStorage.setItem('role', 'admin');
        dispatch(loginAccount());
        openNotification('Thành công', 'Đăng nhập thành công', 'success')
        setTimeout(() => {
          navigate('/admin/manage-shop');
        }, 500)
      }
      else{
        openNotification('Thất bại', 'Bạn không phải Admin', 'error');
      }
    }
    else{
      openNotification('Thất bại', 'Tài khoản hoặc mật khẩu không chính xác', 'error');
    }
  }

  return (
    <>
      {contextHolder}
      <div className="login-admin">
        <h1 className = "animate__animated animate__bounce">Login</h1>
        {/* <p>Bạn chưa có tài khoản? <NavLink to='#'>Đăng ký</NavLink></p> */}
        <Form onFinish={handleSubmit}>
          <Form.Item name='email' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]} >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" className="login-button" type="primary">Login</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default LoginAdmin;