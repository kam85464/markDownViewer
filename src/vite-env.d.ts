/* eslint-disable */
/// <reference types="vite/client" />

declare module 'markdown-it-katex';
declare module 'markdown-it-task-lists';

declare module '*?worker'  {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}