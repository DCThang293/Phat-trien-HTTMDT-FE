import { Button, Form, Input, notification } from "antd";
import './Register.scss';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function Register() {

  // const [user, setUser] = useState();

  // const getUser = async () => {
  //   const response = await fetch('http://localhost:3002/users');
  //   const user_tmp = await response.json();
  //   setUser(user_tmp);
  //   return user_tmp;
  // }

  // useEffect(() => {
  //   getUser();
  // }, [])

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description, type) => {
    api[type]({
      message: <h3 style={{margin: "0", padding: "0"}}>{message}</h3>,
      description: description,
      duration: 1,
    });
  };

  const navigate = useNavigate();

  const registerAccount = async (fullname, email, password) => {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullname, email, password})
    })
    return await response.json();
  }

  // const generateRandomString = (length = 20) => {
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let result = '';
  //   const charactersLength = characters.length;
    
  //   for (let i = 0; i < length; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }
    
  //   return result;
  // }

  const handleSubmit = async (e) => {
    // const token = generateRandomString();
    // const response = await fetch(`http://localhost:3002/users?email=${e.email}`);
    // const checkExitsEmail = await response.json();

    const response = await registerAccount(e.fullName, e.email, e.password);

    if(response.description === "Email already exists"){ 
      openNotification('Thất bại', 'Email đã tồn tại', 'error');
    }
    else{
      if(response){
        openNotification('Thành công', 'Đăng ký thành công', 'success')
        setTimeout(() => {
          navigate('/login');
        }, 500)
      }
      else{
        openNotification('Thất bại', 'Đăng ký thất bại', 'error');
      }
    }
  }

  return (
    <>
      {contextHolder}
      <div className="register">
        <h2 class="animate__animated animate__bounce">Register Account</h2>
        <Form onFinish={handleSubmit}>
          <Form.Item name='fullName' rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
            <Input className="button-focus" placeholder="Full Name" />
          </Form.Item>
          <Form.Item name='email' rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}>
            <Input className="button-focus" placeholder="Email" />
          </Form.Item>
          <Form.Item name='phone' rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: '⚠ Số điện thoại không hợp lệ! Phải là 10 chữ số bắt đầu bằng 03, 05, 07, 08, 09' }
          ]}>
            <Input className="button-focus" placeholder="Số điện thoại" maxLength={10} />
          </Form.Item>
          <Form.Item name='password' rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 8, message: '⚠ Mật khẩu phải có ít nhất 8 ký tự!' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: '⚠ Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)!'
            }
          ]}>
            <Input.Password className="button-focus" placeholder="Mật khẩu (VD: Abc@1234)" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" className="register-button">Register</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default Register;