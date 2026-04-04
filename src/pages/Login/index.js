import { Button, Form, Input, notification } from "antd";
import "./Login.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAccount } from "../../actions/login";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

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
        headers: { "Content-Type": "application/json" },
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
          setTimeout(() => navigate("/"), 500);
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

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { email, displayName } = result.user;
      const response = await fetch(`/api/google?email=${encodeURIComponent(email)}&fullName=${encodeURIComponent(displayName)}`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success && data.data) {
        sessionStorage.clear();
        sessionStorage.setItem("token", data.data.token);
        sessionStorage.setItem("id", data.data.id);
        dispatch(loginAccount());
        openNotification("Thành công", "Đăng nhập Google thành công", "success");
        setTimeout(() => navigate("/"), 500);
      } else {
        openNotification("Thất bại", "Đăng nhập Google thất bại", "error");
      }
    } catch (error) {
      openNotification("Lỗi", "Đăng nhập Google thất bại: " + error.message, "error");
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login">
        <h1 className="animate__animated animate__bounce">Đăng nhập</h1>
        <p>
          Bạn chưa có tài khoản?{" "}
          <NavLink to="/register" className="nav-link-hover">Đăng ký</NavLink>
        </p>
        <Form onFinish={handleSubmit}>
          <Form.Item name="email" rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: '⚠ Email không đúng định dạng!' }
          ]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 8, message: '⚠ Mật khẩu phải có ít nhất 8 ký tự!' }
          ]}>
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <div className="forgot-password">
            <NavLink to="/forgot-password" className="nav-link-hover">Quên mật khẩu?</NavLink>
          </div>
          <Form.Item>
            <Button htmlType="submit" className="login-button" type="primary" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center", margin: "8px 0", color: "#aaa" }}>hoặc</div>
        <Button
          onClick={handleGoogleLogin}
          block
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={20} />
          Đăng nhập với Google
        </Button>
      </div>
    </>
  );
}

export default Login;