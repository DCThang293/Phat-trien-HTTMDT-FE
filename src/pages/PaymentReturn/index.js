import React, { useEffect, useState } from "react";
import { Result, Button, Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentReturn = () => {
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get("vnp_ResponseCode");
    if (responseCode === "00") {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [location]);

  if (status === "loading") return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: 100 }} />;

  return (
    <Result
      status={status === "success" ? "success" : "error"}
      title={status === "success" ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
      subTitle={
        status === "success"
          ? "Đơn hàng của bạn đã được thanh toán qua VNPay."
          : "Giao dịch không thành công hoặc đã bị hủy."
      }
      extra={[
        <Button type="primary" key="home" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>,
        <Button key="history" onClick={() => navigate("/history")}>
          Xem đơn hàng
        </Button>,
      ]}
    />
  );
};

export default PaymentReturn;
