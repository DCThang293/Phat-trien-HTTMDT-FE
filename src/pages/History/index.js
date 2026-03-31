import { Image, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";

function History() {

  const [productsInHistory, setProductsInHistory] = useState([]);
  const userId = sessionStorage.getItem('id');

  const getProductsInHistory = async () => {
    const response = await fetch(`/order/user/get?userId=${userId}`);
    const data = await response.json();
    setProductsInHistory(data.data.reverse());
    return data.data;
  }
  useEffect(() => {
    getProductsInHistory();
  }, []);

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (text, record, index) => index + 1,
      width: 60,
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'productImage',
      key: 'productImage',
      render: (text) => <Image src={text} width={80} />
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Mô tả',
      dataIndex: 'productDescription',
      key: 'productDescription'
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'productBrand',
      key: 'productBrand'
    },
    {
      title: 'Loại',
      dataIndex: 'productCategory',
      key: 'productCategory'
    },
    {
      title: 'Size',
      dataIndex: 'productSize',
      key: 'productSize'
    },
    {
      title: 'Giá',
      dataIndex: 'productPrice',
      key: 'productPrice',
      render: (price) => `${price}`
    },
    {
      title: 'Số lượng',
      dataIndex: 'productQuantity',
      key: 'productQuantity',
    },
    {
      title: 'Tổng tiền',
      key: 'totalPrice',
      render: (_, record) => (
        <Typography.Text strong>
          {record.productPrice * record.productQuantity}
        </Typography.Text>
      )
    },
    {
      title: 'Thời gian thanh toán',
      key: 'time',
      dataIndex: 'time'
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        return (
          <>
            {
              record.status === 'Chờ xử lý' ? (
                <Tag color="yellow">{record.status}</Tag>
              ) : (
                <Tag color="#87d068">{record.status}</Tag>
              )
            }
          </>
        )
      }
    }
  ];

  return (
    <>
      <div className="custom-table-container">
        <h1 style={{marginTop: "0px"}}>Lịch sử mua hàng</h1>
        <Table
          columns={columns}
          dataSource={productsInHistory}
          rowKey="id"
          className="custom-table"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </>
  )
}
export default History;


// const now = new Date();

// // Lấy ra các thông tin cần thiết
// const dayOfWeek = now.toLocaleString('vi-VN', { weekday: 'long' }); // Thứ
// const day = now.getDate(); // Ngày
// const month = now.getMonth() + 1; // Tháng (getMonth() trả về 0-11, nên cần +1)
// const year = now.getFullYear(); // Năm
// const hours = now.getHours(); // Giờ
// const minutes = now.getMinutes(); // Phút

// // Định dạng thành chuỗi
// const formattedDateTime = `Thứ ${dayOfWeek}, ngày ${day} tháng ${month} năm ${year}, ${hours}:${minutes}`;

// console.log(formattedDateTime);
