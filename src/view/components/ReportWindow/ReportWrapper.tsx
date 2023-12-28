import React, { memo } from 'react';
import { Redirect } from 'react-router-dom';
import { useIsMyGeoAvailableAtPageLoadQuery } from 'src/redux/helpers';

function ReportProviderWrapper({ children }: React.PropsWithChildren) {
  const { isSuccess, isError, data } = useIsMyGeoAvailableAtPageLoadQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 5000,
  });

  if (data === 'denied') return <Redirect to='../' />;
  if (isSuccess || isError) return <>{children}</>;
  return <></>;
}

export default memo(ReportProviderWrapper);
