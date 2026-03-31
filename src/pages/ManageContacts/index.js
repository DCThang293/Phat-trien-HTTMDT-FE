import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, Tooltip } from 'antd';
import './ManageContacts.scss';

function ManageContacts() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getContacts = async () => {
    const response = await fetch(`/contact/admin/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    setContacts(data.data.reverse());
  };

  const patchContact = async (updatedContact) => {
    const response = await fetch(`/contact/admin/solve?contactId=${updatedContact.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
    return await response.json();
  }

  useEffect(() => {
    getContacts();
  }, []);

  const handleViewContact = async (contact) => {
    setSelectedContact(contact);
    setIsModalVisible(true);

    if (contact.status === 'Chưa đọc') {
      const updatedContacts = contact;
      updatedContacts.status = 'Đã đọc';
      await patchContact(updatedContacts);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedContact(null);
  };

  const columns = [
    {
      title: 'STT',
      key: 'STT',
      width: 60,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phone',
      align: 'center',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      align: 'center',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      align: 'center',
      render: (_, record) => (
        record.status === 'Đã đọc' ? <Tag color="green">Đã đọc</Tag> : <Tag color="red">Chưa đọc</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewContact(record)}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="manage-contacts" style={{ width: '90%', margin: '0 auto' }}>
      <h1 className="animate__animated animate__fadeInDown" style={{ textAlign: 'center' }}>Quản lý liên hệ</h1>
      <Table className='customer-table' dataSource={contacts} columns={columns} rowKey="id" />

      {/* Modal hiển thị chi tiết liên hệ */}
      <Modal
        title="Chi tiết liên hệ"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
      >
        {selectedContact && (
          <div>
            <p><strong>Họ và tên:</strong> {selectedContact.fullName}</p>
            <p><strong>Email:</strong> {selectedContact.email}</p>
            <p><strong>Số điện thoại:</strong> {selectedContact.phoneNumber}</p>
            <p><strong>Nội dung:</strong> {selectedContact.content}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ManageContacts;
