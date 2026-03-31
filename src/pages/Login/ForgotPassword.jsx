import React from "react";
import { Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`/users/forgot/send?email=${values.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        notification.success({
          message: "Thành công",
          description: "Mã reset mật khẩu đã được gửi đến email của bạn.",
          duration: 4,
        });
        sessionStorage.setItem("resetEmail", values.email);
        navigate("/reset-password");
      } else {
        notification.error({
          message: "Lỗi",
          description: data.description || "Không thể gửi mã reset mật khẩu.",
          duration: 4,
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi gửi yêu cầu.",
        duration: 4,
      });
    }
  };

  return (
    <div className="login">
      <h1 className="animate__animated animate__bounce">Quên mật khẩu</h1>
      <p>Nhập email của bạn để nhận mã đặt lại mật khẩu.</p>
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Gửi mã
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ForgotPassword; // Đảm bảo có export default