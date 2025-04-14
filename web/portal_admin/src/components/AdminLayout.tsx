import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import '../../style/admin.css';

type Props = {
  children: ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  return (
    <div className="admin-layout d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <AdminHeader />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
