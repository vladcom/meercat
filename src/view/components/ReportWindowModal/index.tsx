import { Drawer } from '@mui/material';
import { memo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ReportWindow from '../ReportWindow/ReportWindow';

const ReportWindowModal = function ReportWindowModal() {
  const match = useRouteMatch({ path: '/new-incident' });
  const history = useHistory();

  return (
    <Drawer
      anchor='top'
      open={!!match}
      onClose={() => {
        history.push('/');
      }}
    >
      <ReportWindow />
    </Drawer>
  );
};

export default memo(ReportWindowModal);
