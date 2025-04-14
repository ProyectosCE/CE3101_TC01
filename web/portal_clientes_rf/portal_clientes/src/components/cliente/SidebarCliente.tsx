import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWallet,
  faExchangeAlt,
  faMoneyBillWave,
  faCreditCard,
  faHandHoldingUsd,
} from '@fortawesome/free-solid-svg-icons';

const SidebarCliente = () => {
  return (
    <nav className="sidebar bg-dark text-white p-3">
      <h4 className="mb-4">TecBank Cliente</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link href="/cliente/saldos" className="nav-link text-white">
            <FontAwesomeIcon icon={faWallet} className="me-2" />
            Consultar Saldos
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/cliente/movimientos" className="nav-link text-white">
            <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
            Ver Movimientos
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/cliente/transferencias" className="nav-link text-white">
            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
            Transferencias
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/cliente/prestamos" className="nav-link text-white">
            <FontAwesomeIcon icon={faHandHoldingUsd} className="me-2" />
            Pago de Préstamos
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/cliente/tarjetas" className="nav-link text-white">
            <FontAwesomeIcon icon={faCreditCard} className="me-2" />
            Pago de Tarjetas
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarCliente;
