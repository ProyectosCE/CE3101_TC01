import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/client.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from '@/stores/authStore';

type Props = {
  children: ReactNode;
  onNavigate: (page: string) => void;
};

const ClientLayout = ({ children, onNavigate }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { username, userInfo, logout } = useAuthStore();

  useEffect(() => {
    if (!userInfo || !username) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router, userInfo, username]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { label: "Principal", page: "" },
    { label: "Cuentas", page: "cuentas" },
    { label: "Tarjetas", page: "tarjetas" },
    { label: "Préstamos", page: "prestamos" },
    { label: "Transferencias", page: "transferencias" },
  ];

  if (isLoading) {
    return null; // Render nothing while loading
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>TECBANK</h1>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.page}
              className={styles.navButton}
              onClick={() => onNavigate(item.page)}
            >
              {item.label}
            </button>
          ))}
          <div className={styles.profileSection}>
            <button 
              className={styles.profileButton}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <FontAwesomeIcon icon={faUserCircle} size="2x" />
            </button>
            {isDrawerOpen && (
              <div className={styles.profileDrawer}>
                <div className={styles.profileInfo}>
                  <FontAwesomeIcon icon={faUserCircle} size="3x" />
                  <h3>{userInfo?.nombreCompleto}</h3>
                  <span className={styles.username}>{username}</span>
                  <button 
                    className={styles.logoutButtonDrawer}
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
      <main className={styles.body}>{children}</main>
    </div>
  );
};

export default ClientLayout;
