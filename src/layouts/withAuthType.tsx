import React from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import { UserRole, currentRoleSelector } from 'src/redux/auth';

export default function withAuthType(themeType: UserRole[]) {
  return function wrappedFunction<P>(WrappedComponent: React.ComponentType<P>) {
    return function withProps(props: P): JSX.Element | null {
      const currentAuthStatus = useAppSelector(currentRoleSelector);
      if (themeType.includes(currentAuthStatus)) {
        return <WrappedComponent {...(props as React.PropsWithChildren<P>)} />;
      }
      return null;
    };
  };
}
