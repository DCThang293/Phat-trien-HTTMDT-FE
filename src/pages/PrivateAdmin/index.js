import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Giả sử bạn lưu trạng thái đăng nhập trong localStorage hoặc trong context.
const isAuthenticated = () => {
  // Kiểm tra trạng thái đăng nhập (ví dụ sử dụng localStorage, sessionStorage hoặc Context API)
  const token = sessionStorage.getItem('token');  // Ví dụ lấy thông tin user từ localStorage
  const role = sessionStorage.getItem('role');
  return token !== null && role === 'admin';
};

const PrivateAdmin = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/admin" />;
};

export default PrivateAdmin;