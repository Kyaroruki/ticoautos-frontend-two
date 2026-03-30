import Navbar from "./Navbar";
import { Outlet } from 'react-router-dom';

const MainContainer = () => {
  const isAuthenticated = !!sessionStorage.getItem('token');
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default MainContainer;