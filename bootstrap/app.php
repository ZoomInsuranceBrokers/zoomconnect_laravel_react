<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

            // Register route middleware aliases used by routes (Laravel 12 style)
            $middleware->alias([
                'permission' => \App\Http\Middleware\CheckPermission::class,
                'redirect.if.superadmin' => \App\Http\Middleware\RedirectIfSuperadmin::class,
                'superadmin.auth' => \App\Http\Middleware\EnsureSuperadminAuthenticated::class,
                'redirect.if.employee' => \App\Http\Middleware\RedirectIfEmployee::class,
                'employee.auth' => \App\Http\Middleware\EnsureEmployeeAuthenticated::class,
            ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
