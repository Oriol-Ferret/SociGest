// Tipos globales para los módulos de React
declare module '*.tsx' {
  import type { ComponentType } from 'react';
  const component: ComponentType;
  export default component;
}

// Para archivos de estilos
declare module '*.css';
declare module '*.scss';

// Para archivos de imágenes
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
