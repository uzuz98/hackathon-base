//This function will be create on another services
import React, { FC, PropsWithChildren } from 'react';
import { THooksMap } from '../types';
import { validateHookName } from '../validate';
export interface HookContextType {
  add_hook: (
    hookName: string,
    callback: Function,
    type: 'action' | 'filter',
    pluginName: string
  ) => void;
  remove_action: (hookName: string) => void;
  remove_filter: (hookName: string) => void;
  remove_all_hook: (pluginName: string) => void;
  do_action: (hookName: string, ...args: any[]) => any;
  apply_filter: (hookName: string, ...args: any[]) => any;
  has_action: (hookName: string) => boolean;
  has_filter: (hookName: string) => boolean;
}

export const HookContext = React.createContext<HookContextType>(
  {} as HookContextType
);

export const HookProvider: FC<PropsWithChildren> = ({ children }) => {
  const [actions, setActions] = React.useState<THooksMap>({});
  const [filters, setFilters] = React.useState<THooksMap>({});

  // console.log(`🐳 -> actions`, actions);
  // console.log(`🐳 -> filters`, filters);

  const add_hook = (
    hookName: string,
    callback: Function,
    type: 'action' | 'filter',
    pluginName: string,
    priority = 10
  ) => {
    if (!validateHookName(hookName)) {
      return;
    }

    if ('function' !== typeof callback) {
      // eslint-disable-next-line no-console
      console.error('The hook callback must be a function.');
      return;
    }

    // Validate numeric priority
    if ('number' !== typeof priority) {
      // eslint-disable-next-line no-console
      console.error('If specified, the hook priority must be a number.');
      return;
    }
    // Determine the state updater based on hook type
    const updater = type === 'action' ? setActions : setFilters;

    // Add the hook
    updater((prev: Record<string, any[]>) => ({
      ...prev,
      [hookName]: [
        ...(prev[hookName] ?? []),
        { pluginName, callback, type, priority },
      ],
    }));
  };

  const remove_action = (hookName: string) => {
    setActions((prev: THooksMap) => {
      const updatedActions = { ...prev };
      if (updatedActions[hookName]) {
        delete updatedActions[hookName];
      }
      return updatedActions;
    });
  };
  const remove_filter = (hookName: string) => {
    setFilters((prev: THooksMap) => {
      const updatedFilters = { ...prev };
      if (updatedFilters[hookName]) {
        delete updatedFilters[hookName];
      }
      return updatedFilters;
    });
  };
  const remove_all_hook = (pluginName: string) => {
    const removePluginFromHooks = (hooks: THooksMap) => {
      const updatedHooks = { ...hooks };
      for (const key in updatedHooks) {
        updatedHooks[key] = updatedHooks[key].filter(
          (hook) => hook.pluginName !== pluginName
        );
        if (updatedHooks[key].length === 0) {
          delete updatedHooks[key];
        }
      }
      return updatedHooks;
    };

    setActions((prev: THooksMap) => removePluginFromHooks(prev));
    setFilters((prev: THooksMap) => removePluginFromHooks(prev));
  };
  const do_action = (hookName: string, ...args: any[]) => {
    const _actionsList = actions[hookName] ?? [];

    return _actionsList.map((item: any) => {
      return item.callback(...args);
    });
  };

  const has_action = (hookName: string) => {
    return !!actions[hookName];
  };
  const has_filter = (hookName: string) => {
    return !!filters[hookName];
  };
  const apply_filter = (hookName: string, ...args: any) => {
    const _filterList = filters[hookName] ?? [];

    return _filterList.map((item: any) => {
      return item.callback(...args);
    });
  };

  return (
    <HookContext.Provider
      value={{
        add_hook,
        remove_action,
        do_action,
        has_action,
        has_filter,
        apply_filter,
        remove_filter,
        remove_all_hook,
      }}
    >
      {children}
    </HookContext.Provider>
  );
};

export const useGlobalHook = () => React.useContext(HookContext);
