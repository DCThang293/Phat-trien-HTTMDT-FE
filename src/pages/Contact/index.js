import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, notification } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined, MessageOutlined, EnvironmentOutlined } from '@ant-design/icons';
import './Contact.scss';

const Contact = () => {
  const [form] = Form.useForm();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description, type) => {
    api[type]({
      message: <h3 style={{margin: "0", padding: "0"}}>{message}</h3>,
      description: description,
      duration: 1,
    });
  };

  // const [contacts, setContacts] = useState([]);

  // const getContacts = async () => {
  //   const response = await fetch(`http://localhost:3002/contacts`);
  //   const tmp = await response.json();
  //   setContacts(tmp);
  //   return tmp;
  // }

  // useEffect(() => {
  //   getContacts();
  // }, []);


  const postContact = async (contact) => {
    const response = await fetch(`/contact/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    })
    return await response.json();
  }

  const onFinish = async (e) => {
    const fullName = e.name;
    const email = e.email;
    const phone = e.phone;
    const content = e.message;

    const contact = { fullName, email, phone, content};

    const response = await postContact(contact);

    if(response){
      openNotification('Thành công', 'Bạn đã gửi liên hệ thành công. Chúng tôi sẽ sớm phản hồi bạn trong thời gian sớm nhất.', 'success');
      setTimeout(() => {
        form.resetFields();
      }, 1000);
    }
    else{
      openNotification('Thất bại', 'Gửi liên hệ thất bại. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <>
      {contextHolder}
      <div className="contact-container">
        <h2 className="contact-title animate__animated animate__heartBeat">Liên hệ với chúng tôi</h2>
        <Row gutter={40}>
          <Col xs={24} md={12} className='animate__animated animate__fadeInLeftBig animate__fast'>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="contact-form"
            >
              <Form.Item
                label="Tên của bạn"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
              >
                <Input placeholder="Tên của bạn" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email của bạn!' },
                  { type: 'email', message: 'Định dạng email không hợp lệ!' },
                ]}
              >
                <Input placeholder="Email của bạn" prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của bạn!' }]}
              >
                <Input placeholder="Số điện thoại của bạn" prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item
                label="Tin nhắn"
                name="message"
                rules={[{ required: true, message: 'Vui lòng nhập tin nhắn của bạn!' }]}
              >
                <Input.TextArea placeholder="Viết tin nhắn của bạn ở đây" rows={4} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Gửi liên hệ
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} md={12} className='animate__animated animate__fadeInRightBig animate__faster'>
            <div className="contact-info" style={{paddingTop: "0px"}}>
              <h3 style={{marginTop: "0px"}}>Thông tin liên hệ</h3>
              <p><EnvironmentOutlined /> Địa chỉ: Km10, đường Nguyễn Trãi, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội</p>
              <p><MailOutlined /> Email: abc@gmail.com</p>
              <p><PhoneOutlined /> Số điện thoại: 0123 456 789</p>
              <p>Giờ làm việc: Thứ 2 - Thứ 7 (8:00 - 18:00)</p>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.301554082101!2d105.78532367471315!3d20.980545889433944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acce762c2bb9%3A0xbb64e14683ccd786!2zSOG7jWMgVmnhu4duIENOIELGsHUgQ2jDrW5oIFZp4buFbiBUaMO0bmcgLSBIw6AgxJDDtG5n!5e0!3m2!1svi!2s!4v1731254244562!5m2!1svi!2s"></iframe>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Contact;
