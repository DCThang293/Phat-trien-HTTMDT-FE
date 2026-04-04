import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Modal, Input, notification, Space } from "antd";

const { TextArea } = Input;

const ManageReturns = () => {
  const [returns, setReturns] = useState([]);
  const [noteModal, setNoteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [solveStatus, setSolveStatus] = useState(1);

  const [api, contextHolder] = notification.useNotification();

  const getReturns = async () => {
    const res = await fetch("/return-request/admin/get/all", {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    const data = await res.json();
    setReturns((data.data || []).reverse());
  };

  useEffect(() => { getReturns(); }, []);

  const openSolveModal = (record, status) => {
    setSelected(record);
    setSolveStatus(status);
    setAdminNote("");
    setNoteModal(true);
  };

  const handleSolve = async () => {
    const res = await fetch(
      `/return-request/admin/solve?id=${selected.id}&status=${solveStatus}&adminNote=${encodeURIComponent(adminNote)}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      }
    );
    const data = await res.json();
    if (data.success) {
      api.success({ message: data.description, duration: 2 });
      setNoteModal(false);
      getReturns();
    }
  };

  const columns = [
    { title: "STT", key: "index", render: (_, __, i) => i + 1, width: 60, align: "center" },
    { title: "Mã đơn hàng", dataIndex: "orderId", key: "orderId", render: (v) => `#${v}` },
    {
      title: "Thông tin khách hàng", key: "userInfo",
      render: (_, r) => (
        <div>
          <p><strong>Tên:</strong> {r.userName}</p>
          <p><strong>Email:</strong> {r.userEmail}</p>
          <p><strong>SĐT:</strong> {r.userPhone}</p>
        </div>
      )
    },
    { title: "Lý do trả hàng", dataIndex: "reason", key: "reason" },
    { title: "Ghi chú admin", dataIndex: "adminNote", key: "adminNote", render: (v) => v || "-" },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (status) => (
        <Tag color={status === "Chờ xử lý" ? "orange" : status === "Đã duyệt" ? "green" : "red"}>
          {status}
        </Tag>
      )
    },
    {
      title: "Hành động", key: "action",
      render: (_, record) => (
        record.status === "Chờ xử lý" ? (
          <Space>
            <Button type="primary" size="small" onClick={() => openSolveModal(record, 1)}>Duyệt</Button>
            <Button danger size="small" onClick={() => openSolveModal(record, 2)}>Từ chối</Button>
          </Space>
        ) : <span style={{ color: "#aaa" }}>Đã xử lý</span>
      )
    }
  ];

  return (
    <div>
      {contextHolder}
      <h1 className="animate__animated animate__fadeInDown" style={{ textAlign: "center" }}>
        Quản lý yêu cầu trả hàng
      </h1>
      <Table
        dataSource={returns}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={solveStatus === 1 ? "Duyệt yêu cầu trả hàng" : "Từ chối yêu cầu trả hàng"}
        open={noteModal}
        onCancel={() => setNoteModal(false)}
        onOk={handleSolve}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ danger: solveStatus === 2 }}
      >
        <p><strong>Đơn hàng:</strong> #{selected?.orderId}</p>
        <p><strong>Lý do khách:</strong> {selected?.reason}</p>
        <p><strong>Ghi chú (tùy chọn):</strong></p>
        <TextArea
          rows={3}
          placeholder="Nhập ghi chú cho khách hàng..."
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ManageReturns;
