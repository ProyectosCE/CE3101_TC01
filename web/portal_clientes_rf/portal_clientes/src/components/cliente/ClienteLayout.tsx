import React, { ReactNode } from 'react';
import SidebarCliente from './SidebarCliente';
import ClienteHeader from './ClienteHeader';


type Props = {
  children: ReactNode;
};

const ClienteLayout = ({ children }: Props) => {
  return (
    <div className="cliente-layout d-flex">
      <SidebarCliente />
      <div className="flex-grow-1">
        <ClienteHeader />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default ClienteLayout;
