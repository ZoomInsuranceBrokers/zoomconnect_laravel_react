<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Carbon\Carbon;

class RoutesMasterSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        
        // Clear existing routes
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('routes_master')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        // Get all routes under the superadmin prefix dynamically
        $allRoutes = collect(Route::getRoutes())->filter(function ($route) {
            $uri = $route->uri();
            return str_starts_with($uri, 'superadmin/');
        })->map(function ($route) use ($now) {
            $name = $route->getName();
            $uri = $route->uri();
            
            // If route is unnamed, synthesize a name from URI
            if (!$name) {
                $synth = 'superadmin.' . str_replace('/', '.', trim($uri, '/'));
                $synth = preg_replace('/\{[^}]+\}/', 'param', $synth);
                $name = $synth;
            }
            
            $methods = implode('|', $route->methods());
            
            // Determine module and action from route name
            $parts = explode('.', str_replace('superadmin.', '', $name));
            $module = $parts[0] ?? 'general';
            $action = end($parts);
            
            // Map common actions
            $actionMap = [
                'index' => 'view',
                'show' => 'view',
                'create' => 'create',
                'store' => 'create',
                'edit' => 'edit',
                'update' => 'edit',
                'destroy' => 'delete',
                'delete' => 'delete',
            ];
            
            $action = $actionMap[$action] ?? $action;
            
            return [
                'route_name' => $name,
                'route_path' => '/' . $uri,
                'module' => $module,
                'action' => $action,
                'method' => $methods === 'GET|HEAD' ? 'GET' : (str_contains($methods, 'POST') ? 'POST' : (str_contains($methods, 'PUT') ? 'PUT' : (str_contains($methods, 'DELETE') ? 'DELETE' : $methods))),
                'description' => $this->generateDescription($name),
                'is_active' => 1,
                'created_by' => 1,
                'created_on' => $now,
                'updated_on' => $now,
            ];
        })->values()->toArray();
        
        // Insert routes in chunks
        if (!empty($allRoutes)) {
            foreach (array_chunk($allRoutes, 50) as $chunk) {
                DB::table('routes_master')->insert($chunk);
            }
            $this->command->info('✓ Inserted ' . count($allRoutes) . ' routes into routes_master table');
        } else {
            $this->command->warn('No superadmin routes found!');
        }
    }
    
    private function generateDescription(string $routeName): string
    {
        // Convert route name to readable description
        $name = str_replace('superadmin.', '', $routeName);
        
        $descriptions = [
            'dashboard' => 'View Dashboard',
            'admin.blogs.index' => 'View Blogs List',
            'admin.blogs.create' => 'Create Blog',
            'admin.blogs.store' => 'Store Blog',
            'admin.blogs.edit' => 'Edit Blog',
            'admin.blogs.update' => 'Update Blog',
            'admin.blogs.destroy' => 'Delete Blog',
            'admin.faqs.index' => 'View FAQs List',
            'admin.faqs.store' => 'Create FAQ',
            'admin.faqs.update' => 'Update FAQ',
            'admin.faqs.destroy' => 'Delete FAQ',
            'admin.resources.index' => 'View Resources List',
            'admin.resources.create' => 'Create Resource',
            'admin.resources.store' => 'Store Resource',
            'admin.resources.edit' => 'Edit Resource',
            'admin.resources.update' => 'Update Resource',
            'admin.resources.destroy' => 'Delete Resource',
            'admin.roles.create' => 'Create Role',
            'admin.roles.update' => 'Update Role',
            'admin.roles.delete' => 'Delete Role',
            'admin.roles-permissions.index' => 'View Roles & Permissions',
            'admin.roles.permissions' => 'View Role Permissions',
            'admin.roles.permissions.update' => 'Update Role Permissions',
            'admin.roles.permissions.manage' => 'Manage Role Permissions',
            'admin.surveys.index' => 'View Surveys List',
            'admin.surveys.create' => 'Create Survey',
            'admin.surveys.store' => 'Store Survey',
            'admin.surveys.edit' => 'Edit Survey',
            'admin.surveys.update' => 'Update Survey',
            'admin.surveys.destroy' => 'Delete Survey',
            'corporate.list.index' => 'View Companies List',
            'corporate.create' => 'Create Company',
            'corporate.store' => 'Store Company',
            'corporate.edit' => 'Edit Company',
            'corporate.update' => 'Update Company',
            'corporate.labels.index' => 'View Corporate Labels',
            'corporate.labels.store' => 'Create Corporate Label',
            'corporate.labels.update' => 'Update Corporate Label',
            'corporate.labels.destroy' => 'Delete Corporate Label',
            'corporate.groups.index' => 'View Corporate Groups',
            'corporate.groups.store' => 'Create Corporate Group',
            'corporate.groups.update' => 'Update Corporate Group',
            'corporate.groups.destroy' => 'Delete Corporate Group',
            'wellness.vendor-list' => 'View Wellness Vendors',
            'wellness.category.index' => 'View Wellness Categories',
            'wellness.category.store' => 'Create Wellness Category',
            'wellness.category.update' => 'Update Wellness Category',
            'wellness.services.index' => 'View Wellness Services',
            'wellness.services.store' => 'Create Wellness Service',
            'wellness.services.update' => 'Update Wellness Service',
            'marketing.campaigns.index' => 'View Marketing Campaigns',
            'marketing.campaigns.store' => 'Create Campaign',
            'marketing.campaigns.update' => 'Update Campaign',
            'marketing.campaigns.destroy' => 'Delete Campaign',
            'marketing.welcome-mailer.index' => 'View Welcome Mailers',
            'marketing.message-template.index' => 'View Message Templates',
            'marketing.push-notifications.index' => 'View Push Notifications',
            'policy.enrollment-lists.index' => 'View Enrollment Lists',
            'policy.enrollment-lists.create' => 'Create Enrollment',
            'policy.enrollment-lists.store' => 'Store Enrollment',
            'policy.enrollment-lists.edit' => 'Edit Enrollment',
            'policy.enrollment-lists.update' => 'Update Enrollment',
            'policy.policies.index' => 'View Policies',
            'policy.policies.create' => 'Create Policy',
            'policy.policies.store' => 'Store Policy',
            'policy.policies.edit' => 'Edit Policy',
            'policy.policies.update' => 'Update Policy',
            'policy.policy-users.index' => 'View Policy Users',
            'policy.endorsements.index' => 'View Endorsements',
            'policy.insurance.index' => 'View Insurers',
            'policy.tpa.index' => 'View TPAs',
            'policy.cd-accounts.index' => 'View CD Accounts',
        ];
        
        return $descriptions[$name] ?? ucwords(str_replace(['.', '_', '-'], ' ', $name));
    }
}
