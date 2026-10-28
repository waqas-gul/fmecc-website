import { useEffect, useState } from "react";

/**
 * Creates GPU resources (materials, geometries, textures) once and disposes them on unmount.
 * R3F disposes objects declared in JSX itself; anything built by hand and shared goes through here.
 */
export function useDisposables<T extends Record<string, { dispose(): void }>>(create: () => T): T {
  const [resources] = useState(create);
  useEffect(() => () => Object.values(resources).forEach((resource) => resource.dispose()), [resources]);
  return resources;
}
