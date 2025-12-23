import React from 'react';
import { usePermissions } from '../Hooks/usePermissions';

/**
 * CanAccess Component
 * Conditionally render children based on user permissions
 * 
 * Usage:
 * <CanAccess route="superadmin.admin.blogs.create">
 *   <CreateButton />
 * </CanAccess>
 * 
 * <CanAccess module="companies" action="create">
 *   <CreateButton />
 * </CanAccess>
 */
/**
 * CanAccess Component
 * Conditionally render children based on user permissions
 * Matches backend CheckPermission middleware logic
 * 
 * Usage:
 * <CanAccess route="superadmin.admin.blogs.create">
 *   <CreateButton />
 * </CanAccess>
 * 
 * <CanAccess module="companies" action="create">
 *   <CreateButton />
 * </CanAccess>
 */
export default function CanAccess({ route, module, action, any, all, fallback = null, children }) {
    const { hasRoute, hasModule, hasAny, hasAll, roleId, permissions } = usePermissions();

    let hasPermission = false;

    if (route) {
        hasPermission = hasRoute(route);
    } else if (module && action) {
        hasPermission = hasModule(module, action);
    } else if (any && Array.isArray(any)) {
        hasPermission = hasAny(...any);
    } else if (all && Array.isArray(all)) {
        hasPermission = hasAll(...all);
    }

    if (!hasPermission) {
        if (process.env.NODE_ENV !== 'production') {
            try {
                // Get actual permission keys to help debugging
                const routes = permissions?.routes || {};
                const routeKeys = Object.keys(routes);
                
                // eslint-disable-next-line no-console
                console.debug('[CanAccess] Access denied', {
                    checking: { route, module, action, any, all },
                    result: { hasPermission, roleId },
                    availablePermissions: {
                        totalRoutes: routeKeys.length,
                        sampleRoutes: routeKeys.slice(0, 15),
                        hasThisRoute: route ? (routes[route] === true ? 'YES' : 'NO') : 'N/A'
                    }
                });
            } catch (e) {
                // ignore
            }
        }
        return fallback;
    }

    return <>{children}</>;
}
