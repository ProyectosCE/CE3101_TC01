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
import '../../style/admin.css';

const Sidebar = () => {
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
            Pr\u00e9stamos
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin/mora" className="nav-link text-white">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            Mora
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
