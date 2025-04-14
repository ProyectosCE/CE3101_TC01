/*
================================== LICENCIA ==============
====================================
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Jimmy Feng Feng,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

/**
 * Component: Sidebar
 * Barra lateral de navegación para el panel de administración.
 *
 * Props:
 * - Ninguna (la barra es estática y no recibe props en esta versión).
 *
 * Example:
 * <Sidebar />
 */

import { useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../pages/index';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield,
  faUsers,
  faMoneyCheckAlt,
  faCreditCard,
  faUserTie,
  faHandHoldingUsd,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('session');
    setIsLoggedIn(false);
    router.push('/login'); // Redirect to login after logout
  };

  return (
    <nav className="sidebar bg-dark text-white p-3">
      <h4 className="mb-4">TecBank Admin</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link href="/admin/roles" className="nav-link text-white">
            <FontAwesomeIcon icon={faUserShield} className="me-2" />
            Roles
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/clientes" className="nav-link text-white">
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            Clientes
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/cuentas" className="nav-link text-white">
            <FontAwesomeIcon icon={faMoneyCheckAlt} className="me-2" />
            Cuentas
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/tarjetas" className="nav-link text-white">
            <FontAwesomeIcon icon={faCreditCard} className="me-2" />
            Tarjetas
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/asesores" className="nav-link text-white">
            <FontAwesomeIcon icon={faUserTie} className="me-2" />
            Asesores
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/prestamos" className="nav-link text-white">
            <FontAwesomeIcon icon={faHandHoldingUsd} className="me-2" />
            Préstamos
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/mora" className="nav-link text-white">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            Mora
          </Link>
        </li>
      </ul>
      <button className="btn btn-danger mt-4 w-100" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Sidebar;
