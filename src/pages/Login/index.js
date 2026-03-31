import { Button, Form, Input, notification } from "antd";
import "./Login.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAccount } from "../../actions/login";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description, type) => {
    api[type]({
      message: <h3 style={{ margin: "0", padding: "0" }}>{message}</h3>,
      description: description,
      duration: 4,
    });
  };

  const checkInformation = async (email, password) => {
    try {
      const response = await fetch(`/api/signin?email=${email}&password=${password}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error("Không thể kết nối đến server. Vui lòng thử lại.");
    }
  };

  const handleSubmit = async (values) => {
    try {
      sessionStorage.clear();
      const response = await checkInformation(values.email, values.password);
      if (response) {
        if (response.isActive) {
          sessionStorage.setItem("token", response.token);
          sessionStorage.setItem("id", response.id);
          dispatch(loginAccount());
          openNotification("Thành công", "Đăng nhập thành công", "success");
          setTimeout(() => {
            navigate("/");
          }, 500);
        } else {
          openNotification("Thất bại", "Tài khoản của bạn đã bị vô hiệu hóa", "error");
        }
      } else {
        openNotification("Thất bại", "Tài khoản hoặc mật khẩu không chính xác", "error");
      }
    } catch (error) {
      openNotification("Lỗi", error.message || "Đã xảy ra lỗi. Vui lòng thử lại.", "error");
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login">
        <h1 className="animate__animated animate__bounce">Đăng nhập</h1>
        <p>
          Bạn chưa có tài khoản?{" "}
          <NavLink to="/register" className="nav-link-hover">
            Đăng ký
          </NavLink>
        </p>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <div className="forgot-password">
            <NavLink to="/forgot-password" className="nav-link-hover">
              Quên mật khẩu?
            </NavLink>
          </div>
          <Form.Item>
            <Button htmlType="submit" className="login-button" type="primary">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default Login;