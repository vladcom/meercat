import { memo, useEffect } from "react";
import Pages from 'src/view/pages/index';
import Navbars from './Navbars';
import { useLocation, useParams } from "react-router-dom";
import { useNotificationContext } from "../../components/NotificationsContext/NotificationsProvider";

const DashboardRoutes = () => {
  const { search } = useLocation();
  const { openSnackbar } = useNotificationContext();
  useEffect(() => {
    if (search === '?emailConfirmed=true') {
      openSnackbar({
        open: true,
        status: 'success',
        message: `Email confirmed successfully`,
      });
    }
  }, [openSnackbar, search]);
  return (
    <>
      <Navbars />
      <Pages />
    </>
  );
};

export default memo(DashboardRoutes);
