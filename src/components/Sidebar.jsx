import Logo from './Logo';
import AppNav from './AppNav';
import styles from './Sidebar.module.css';
import { Outlet } from 'react-router-dom';

function Sidebar() {
  const year = new Date().getFullYear();
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {year} by WorldWise Inc.
        </p>
      </footer>
    </div>
  );
}

export default Sidebar;
