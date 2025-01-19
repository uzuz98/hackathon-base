import { useGlobalHook, useRegisterPlugin } from '@repo/plugin-sdk';
import React from 'react';
import CopyTrade from './components/CopyTrade';
import { CheckHubProvider } from './context/checkHubContext';
import { Theme } from '@radix-ui/themes';

import '@radix-ui/themes/styles.css';

export const PluginCopyTrade = () => {
  const { add_hook } = useGlobalHook();

  const bootstrap = () => {
    //This fn can be extracted;
    add_hook(
      'subtitle',
      () => {
        return <div></div>;
      },
      'action',
      'PluginCopyTrade'
    );
    add_hook(
      'dataPortfolio',
      () => {
        return undefined;
      },
      'filter',
      'PluginCopyTrade'
    );
  };

  useRegisterPlugin({
    name: 'PluginCopyTrade',
    author: 'Team-2',
    bootstrap,
  });
  return (
    <div className="border rounded-lg p-4 border-dividerColorDefault">
      <Theme>
        <CheckHubProvider>
          <CopyTrade />
        </CheckHubProvider>
      </Theme>
    </div>
  );
};
