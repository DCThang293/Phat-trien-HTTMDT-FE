import React from "react";
import { Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

function ResetPassword() {
  const navigate = useNavigate();
  const initialEmail = sessionStorage.getItem("resetEmail") || "";

  const handleSubmit = async (values) => {
    try {
      const verifyResponse = await fetch(
        `/users/forgot/verify?email=${values.email}&code=${values.code}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        notification.error({
          message: "Lỗi",
          description: verifyData.description || "Mã không hợp lệ.",
          duration: 2,
        });
        return;
      }

      const resetResponse = await fetch(
        `/users/forgot/reset/password?email=${values.email}&code=${values.code}&newPassword=${values.newPassword}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resetData = await resetResponse.json();
      if (resetData.success) {
        notification.success({
          message: "Thành công",
          description: "Mật khẩu đã được đặt lại thành công.",
          duration: 2,
        });
        sessionStorage.removeItem("resetEmail");
        navigate("/login");
      } else {
        notification.error({
          message: "Lỗi",
          description: resetData.description || "Không thể đặt lại mật khẩu.",
          duration: 2,
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi. Vui lòng thử lại.",
        duration: 2,
      });
    }
  };

  return (
    <div className="login">
      <h1 className="animate__animated animate__bounce">Đặt lại mật khẩu</h1>
      <p>Nhập mã đặt lại và mật khẩu mới của bạn.</p>
      <Form onFinish={handleSubmit} initialValues={{ email: initialEmail }}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã đặt lại!" }]}
        >
          <Input placeholder="Mã đặt lại" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password placeholder="Mật khẩu mới" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ResetPassword; // Đảm bảo có export default