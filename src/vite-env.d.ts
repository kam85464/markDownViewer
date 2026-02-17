/* eslint-disable */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'markdown-it-katex';
declare module 'markdown-it-task-lists';

declare module '*?worker'  {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module 'virtual:pwa-register/react' {
  // @ts-ignore ignore when react is not installed
  import { Dispatch, SetStateAction } from 'react'
  // @ts-ignore ignore when vite-plugin-pwa is not installed
  import { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export interface RegisterSWHook {
    needRefresh: [boolean, Dispatch<SetStateAction<boolean>>]
    offlineReady: [boolean, Dispatch<SetStateAction<boolean>>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }

  export function useRegisterSW(options?: RegisterSWOptions): RegisterSWHook
}