import React, { useEffect, useState } from 'react';
import { Button, Table, Tag } from 'antd';
import './ManageUsers.scss';
import { message } from 'antd';


function ManageUsers() {

  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await fetch(`/users/user/all`);
    const data = await response.json();
    setUsers(data.data);
    return data.data;
  }

  const patchUser = async (e) => {
    const response = await fetch(`/users/admin/handle/${e.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
    return await response.json();
  }

  useEffect(() => {
    getUsers();
  }, [])

  const handleIsActive = async (e) => {
    const newUser = {...e, isActive: !e.isActive};
    const response = await patchUser(newUser);
    if(response){
      if(newUser.isActive){
        message.success('Kích hoạt thành công');
      }
      else message.warning('Đã vô hiệu hóa');
      await getUsers();
    }
  }

  const columns = [
    {
      title: 'STT',
      key: 'STT',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      key: 'role',
      render: (_, record) => {
        return (
          <>
            {
              record.role === "Admin" ? (
                <span style={{color: "red"}}>Admin</span>
              ) : (
                <span style={{color: "blue"}}>User</span>
              )
            }
          </>
        )
      }
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Trạng thái', 
      key: 'isActive',
      render: (_, record) => {
        return (
          <>
            { 
              record.isActive ? (
                <Tag color='green'>Kích hoạt</Tag>
              ) : (
                <Tag color='red'>Vô hiệu hóa</Tag>
              )
            }
          </>
        )
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => {
        return (
          <>
            <Button onClick={() => {handleIsActive(record)}} type='primary' style={{background: record.isActive ? 'red' : 'green'}}>{record.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}</Button>
          </>
        )
      }
    }
  ];

  return (
    <div className="manage-users" style={{width: "90%"}}>
      <h1 className="animate__animated animate__fadeInDown" style={{textAlign: "center"}}>Quản lý người dùng</h1>
      <Table className='customer-table' dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
}

export default ManageUsers;
