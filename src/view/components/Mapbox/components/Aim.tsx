import { memo } from 'react';
import AimComponent from '../../AimComponent/AimComponent';
import { useType } from '../../ReportWindow/ReportWindow';

function MapboxAim() {
  const type = useType();
  if (type) return <AimComponent type={type} />;
  return <></>;
}
export default memo(MapboxAim);
