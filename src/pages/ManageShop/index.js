import { Card, Col, Row } from "antd";
import { DollarOutlined, ShoppingOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';
import './ManageShop.scss';
import { Column } from "@ant-design/charts";
import { useEffect, useState } from "react";

function ManageShop() {

  const [history, setHistory] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);

  const getHistory = async () => {
    const response = await fetch(`/order/admin/get/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setHistory(data.data.data);
    return data.data.data;
  }

  const getContacts = async () => {
    const respnse = await fetch(`/contact/admin/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    const data = await respnse.json();
    setContacts(data.data);
    return data.data;
  }

  const getUsers = async () => {
    const response = await fetch(`/users/user/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setUsers(data.data);
    return data.data;
  }

  useEffect(() => {
    getHistory();
    getContacts();
    getUsers();
  }, []);


  // Hàm xử lý dữ liệu
  const processData = (history) => {
    const dataByDay = {};

    history.forEach((item) => {
      // Sử dụng Regex để tách ngày, tháng, năm từ chuỗi
      const match = item.time.match(/ngày (\d{1,2}) tháng (\d{1,2}) năm (\d{4})/);
      if (!match) return;

      const [_, day, month, year] = match;

      // Định dạng ngày thành "yyyy-MM-dd"
      const formattedDay = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;

      if (!dataByDay[formattedDay]) {
        dataByDay[formattedDay] = { productCount: 0, totalRevenue: 0 };
      }

      dataByDay[formattedDay].productCount += item.productQuantity;
      dataByDay[formattedDay].totalRevenue += item.productQuantity * item.productPrice;
    });

    return Object.keys(dataByDay).map((day) => ({
      day,
      productCount: dataByDay[day].productCount,
      totalRevenue: dataByDay[day].totalRevenue,
    }));
  };

  const data = processData(history);

  const config = {
    data: data.flatMap((item) => [
      { type: "Số lượng sản phẩm", value: item.productCount, day: item.day },
      { type: "Doanh thu", value: item.totalRevenue, day: item.day },
    ]),
    xField: "day",
    yField: "value",
    seriesField: "type",
    smooth: true,  // Thêm thuộc tính smooth ở đây để làm mượt đường
    lineStyle: {
      lineWidth: 3,  // Đặt độ dày đường vẽ
      lineDash: [5, 5],  // Thêm hiệu ứng đứt quãng nếu muốn
    },
    colorField: 'type',
  };
  
  // Lấy ra doanh thu, đơn hàng
  const totalRevenue = history.reduce((sum, item) => sum + item.productPrice, 0);
  const totalOrders = history.reduce((sum, item) => sum + item.productQuantity, 0);

  return (
    <div className="manage-shop">
      <h1 className="animate__animated animate__fadeInDown" style={{ textAlign: 'center' }}>Quản lý cửa hàng</h1>
      <Row gutter={[20, 20]} style={{ marginBottom: "50px" }}>
        <Col span={6}>
          <Card bordered={false} className="stat-card">
            <div className="stat-icon"><DollarOutlined className="stat-icon" style={{ color: '#52c41a' }} /></div>
            <div className="stat-content">
              <div className="stat-title">Doanh thu</div>
              <div className="stat-value">{totalRevenue}</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="stat-card">
            <div className="stat-icon"><ShoppingOutlined className="stat-icon" style={{ color: '#000000' }} /></div>
            <div className="stat-content">
              <div className="stat-title">Đơn hàng</div>
              <div className="stat-value">{totalOrders}</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="stat-card">
            <div className="stat-icon"><MessageOutlined className="stat-icon" style={{ color: '#888888' }} /></div>
            <div className="stat-content">
              <div className="stat-title">Đánh giá</div>
              <div className="stat-value">{contacts.length}</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="stat-card">
            <div className="stat-icon"><TeamOutlined className="stat-icon" style={{ color: '#000000' }} /></div>
            <div className="stat-content">
              <div className="stat-title">Người dùng</div>
              <div className="stat-value">{users.length}</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Thêm tiêu đề cho biểu đồ */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>Biểu đồ thống kê sản phẩm và doanh thu theo ngày</h2>
      </div>

      {/* Biểu đồ */}
      <Column {...config} />
    </div>
  );
}

export default ManageShop;
