import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

/**
 * usePermissions Hook
 * Matches backend CheckPermission middleware logic exactly:
 * - Gets auth.permissions from Inertia (shared by SharePermissions middleware)
 * - Checks permissions.routes[routeName] === true (same as backend DB lookup)
 * - Falls back to fetching from /superadmin/session-user if auth not shared
 */
export function usePermissions() {
    const pageProps = usePage().props || {};

    // Try multiple fallbacks in case middleware didn't share `auth` as expected
    let auth = pageProps.auth ?? pageProps?.props?.auth ?? null;
    if (!auth && pageProps.superadmin_user) {
        // We at least have the session user; backend may not have shared permissions on this request
        auth = {
            user: pageProps.superadmin_user,
            roleId: null,
            userId: null,
            permissions: { routes: {}, modules: {}, routeKeys: [] },
            currentRouteName: pageProps.currentRouteName || null,
            currentPath: pageProps.currentPath || null,
        };
        console.warn('usePermissions - auth not shared; falling back to session user', pageProps.superadmin_user);
    }

    console.debug && console.debug('usePermissions - auth snapshot:', auth);

    // State to hold fetched permissions if we need to fetch from API
    const [fetchedPermissions, setFetchedPermissions] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    // If auth.permissions is empty/missing and we haven't fetched yet, fetch from debug route
    useEffect(() => {
        const perms = auth?.permissions || {};
        const hasPerms = perms.routes && Object.keys(perms.routes).length > 0;
        
        if (!hasPerms && !isFetching && !fetchedPermissions) {
            console.log('[usePermissions] permissions empty, fetching from /superadmin/session-user');
            setIsFetching(true);
            fetch('/superadmin/session-user')
                .then(r => r.json())
                .then(data => {
                    if (data.ok && data.permissions) {
                        console.log('[usePermissions] fetched permissions:', { routeCount: Object.keys(data.permissions.routes || {}).length, roleId: data.roleId });
                        setFetchedPermissions({
                            routes: data.permissions.routes || {},
                            modules: data.permissions.modules || {},
                            routeKeys: data.permissions.routeKeys || [],
                            roleId: data.roleId,
                            userId: data.userId,
                        });
                    } else {
                        console.error('[usePermissions] fetch failed:', data);
                    }
                    setIsFetching(false);
                })
                .catch(err => {
                    console.error('[usePermissions] fetch error:', err);
                    setIsFetching(false);
                });
        }
    }, [auth, isFetching, fetchedPermissions]);

    // Use fetched permissions if available, otherwise use auth.permissions
    const permissions = fetchedPermissions || auth?.permissions || { routes: {}, modules: {}, routeKeys: [] };
    const roleId = fetchedPermissions?.roleId ?? auth?.roleId ?? null;
    console.debug && console.debug('usePermissions - roleId:', roleId);
    const userId = fetchedPermissions?.userId ?? auth?.userId ?? null;
    const currentRouteName = auth?.currentRouteName ?? null;
    const currentPath = auth?.currentPath ?? null;
    const routeKeys = permissions.routeKeys || Object.keys(permissions.routes || {});

    /**
     * Check if user has permission for a specific route
     * Matches CheckPermission middleware logic: checks if route exists in permissions.routes
     */
    const hasRoute = (routeName) => {
        if (!routeName) return false;
        
        // Direct lookup - same as backend: permissions['routes'][routeName] === true
        return permissions.routes && permissions.routes[routeName] === true;
    };

    /**
     * Check if user has permission for a module action
     * Matches backend: permissions['modules']['module.action'] === true
     */
    const hasModule = (module, action) => {
        if (!module || !action) return false;
        const key = `${module}.${action}`;
        return permissions.modules && permissions.modules[key] === true;
    };

    /**
     * Check if user has any of the specified route permissions
     */
    const hasAny = (...routeNames) => {
        return routeNames.some(route => hasRoute(route));
    };

    /**
     * Check if user has all of the specified route permissions
     */
    const hasAll = (...routeNames) => {
        return routeNames.every(route => hasRoute(route));
    };

    /**
     * Best-effort check if a given href path has a permission
     * Attempts direct dot-join mapping then ordered-subsequence matching
     */
    const hasHref = (href) => {
        if (!href) return false;
        // normalize
        const parts = href.split('/').filter(Boolean);
        const meaningful = parts[0] === 'superadmin' ? parts.slice(1) : parts;
        if (!meaningful.length) return false;

        // try dot-joined key
        const key = meaningful.join('.');
        if (hasRoute(key)) return true;

        // ordered subsequence match against routeKeys
        const lowerSegments = meaningful.map(s => s.toLowerCase());
        const matchesOrdered = (permKey) => {
            const lower = permKey.toLowerCase();
            let idx = -1;
            for (const seg of lowerSegments) {
                const found = lower.indexOf(seg, idx + 1);
                if (found === -1) return false;
                idx = found;
            }
            return true;
        };

        return routeKeys.some(k => matchesOrdered(k));
    };

    return {
        hasRoute,
        hasModule,
        hasAny,
        hasAll,
        hasHref,
        permissions,
        routeKeys,
        currentRouteName,
        currentPath,
        roleId,
        userId,
    };
}
