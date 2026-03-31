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
          <Form.Item name='fullName' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input className= "button-focus" placeholder="Full Name" />
          </Form.Item>
          <Form.Item name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input className= "button-focus" placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password className= "button-focus" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" className = "register-button">Register</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default Register;