import { memo } from 'react';
import InformationSheet from 'src/view/components/InformationSheet';
import LocationPage from './LocationPage';

const Incident = function Incident() {
  console.log('incident');
  return (
    <LocationPage>
      <InformationSheet />
    </LocationPage>
  );
};

export default memo(Incident);
