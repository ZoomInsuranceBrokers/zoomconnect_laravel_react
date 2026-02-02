<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vendor;
use App\Models\WellnessCategory;
use App\Models\WellnessService;
use Illuminate\Support\Facades\DB;

class SeedWellnessData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'wellness:seed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed wellness vendors, categories and services data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting wellness data seeding...');

        // Truncate tables
        $this->info('Truncating tables...');
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        WellnessService::truncate();
        WellnessCategory::truncate();
        Vendor::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->info('Tables truncated successfully.');

        // Create Vendors
        $this->info('Creating vendors...');
        $medibuddy = Vendor::create([
            'vendor_name' => 'Medibuddy',
            'logo_url' => null,
            'is_active' => true,
            'is_delete' => false,
        ]);

        $novelhealthtech = Vendor::create([
            'vendor_name' => 'Novel Health Tech',
            'logo_url' => null,
            'is_active' => true,
            'is_delete' => false,
        ]);
        $this->info('Vendors created successfully.');

        // Create Categories
        $this->info('Creating wellness categories...');
        $categories = [
            [
                'category_name' => 'Health Checks',
                'icon_url' => null,
                'description' => 'Comprehensive health screening packages',
                'status' => 1,
            ],
            [
                'category_name' => 'Lab Tests',
                'icon_url' => null,
                'description' => 'Diagnostic laboratory testing services',
                'status' => 1,
            ],
            [
                'category_name' => 'Teleconsultation',
                'icon_url' => null,
                'description' => 'Online doctor consultations',
                'status' => 1,
            ],
            [
                'category_name' => 'Medicine',
                'icon_url' => null,
                'description' => 'Online pharmacy services',
                'status' => 1,
            ],
            [
                'category_name' => 'Doctor Appointment',
                'icon_url' => null,
                'description' => 'Offline doctor consultations',
                'status' => 1,
            ],
            [
                'category_name' => 'Maternity Care',
                'icon_url' => null,
                'description' => 'Pregnancy and maternity services',
                'status' => 1,
            ],
            [
                'category_name' => 'Hospitalization',
                'icon_url' => null,
                'description' => 'Surgical and hospitalization assistance',
                'status' => 1,
            ],
            [
                'category_name' => 'Condition Management',
                'icon_url' => null,
                'description' => 'Chronic condition management programs',
                'status' => 1,
            ],
            [
                'category_name' => 'Health Risk Assessment',
                'icon_url' => null,
                'description' => 'Health risk evaluation services',
                'status' => 1,
            ],
        ];

        $createdCategories = [];
        foreach ($categories as $category) {
            $createdCategories[$category['category_name']] = WellnessCategory::create($category);
        }
        $this->info('Categories created successfully.');

        // Create Wellness Services
        $this->info('Creating wellness services...');
        $services = [
            [
                'vendor_id' => $medibuddy->id,
                'category_id' => $createdCategories['Health Checks']->id,
                'company_id' => 0,
                'wellness_name' => 'Health Checks',
                'icon_url' => null,
                'link' => null,
                'heading' => 'Health Checks',
                'description' => '50% OFF',
                'status' => 1,
            ],
            [
                'vendor_id' => $medibuddy->id,
                'category_id' => $createdCategories['Lab Tests']->id,
                'company_id' => 0,
                'wellness_name' => 'Lab Tests',
                'icon_url' => null,
                'link' => null,
                'heading' => 'Lab Tests',
                'description' => '20% OFF',
                'status' => 1,
            ],
            [
                'vendor_id' => $medibuddy->id,
                'category_id' => $createdCategories['Teleconsultation']->id,
                'company_id' => 0,
                'wellness_name' => 'Talk to Doctor (Specialists)',
                'icon_url' => null,
                'link' => null,
                'heading' => 'Teleconsultation',
                'description' => '100% FREE',
                'status' => 1,
            ],
            [
                'vendor_id' => $medibuddy->id,
                'category_id' => $createdCategories['Medicine']->id,
                'company_id' => 0,
                'wellness_name' => 'Medicine',
                'icon_url' => null,
                'link' => null,
                'heading' => 'Medicine',
                'description' => '25% OFF',
                'status' => 1,
            ],
            [
                'vendor_id' => $medibuddy->id,
                'category_id' => $createdCategories['Doctor Appointment']->id,
                'company_id' => 0,
                'wellness_name' => 'Book Dr. Appointment',
                'icon_url' => null,
                'link' => null,
                'heading' => 'Book Dr. Appointment',
                'description' => '15% OFF',
                'status' => 1,
            ],
            [
                'vendor_id' => $novelhealthtech->id,
                'category_id' => $createdCategories['Teleconsultation']->id,
                'company_id' => 0,
                'wellness_name' => 'Talk to Doctor (GP)',
                'icon_url' => null,
                'link' => null,
                'heading' => 'Talk to Doctor (GP)',
                'description' => '100% FREE',
                'status' => 1,
            ],
            [
                'vendor_id' => $medibuddy->id,
                'category_id' => $createdCategories['Maternity Care']->id,
                'company_id' => 0,
                'wellness_name' => 'Maternity Care Program',
                'icon_url' => null,
                'link' => null,
                'heading' => 'Maternity Care Program',
                'description' => '20% OFF',
                'status' => 1,
            ],
            [
                'vendor_id' => $medibuddy->id,
                'category_id' => $createdCategories['Hospitalization']->id,
                'company_id' => 0,
                'wellness_name' => 'Surgical Assistance',
                'icon_url' => null,
                'link' => null,
                'heading' => 'Plan your Hospitalization',
                'description' => '30% OFF',
                'status' => 1,
            ],
            [
                'vendor_id' => $medibuddy->id,
                'category_id' => $createdCategories['Condition Management']->id,
                'company_id' => 0,
                'wellness_name' => 'Condition Management Program',
                'icon_url' => null,
                'link' => null,
                'heading' => 'Condition Management Program',
                'description' => '15% OFF',
                'status' => 1,
            ],
            [
                'vendor_id' => $medibuddy->id,
                'category_id' => $createdCategories['Health Risk Assessment']->id,
                'company_id' => 0,
                'wellness_name' => 'Health Risk Assessment',
                'icon_url' => null,
                'link' => null,
                'heading' => 'Health Risk Assessment',
                'description' => '100% FREE',
                'status' => 1,
            ],
        ];

        foreach ($services as $service) {
            WellnessService::create($service);
        }
        $this->info('Wellness services created successfully.');

        $this->info('✅ Wellness data seeded successfully!');
        $this->info('Total Vendors: ' . Vendor::count());
        $this->info('Total Categories: ' . WellnessCategory::count());
        $this->info('Total Services: ' . WellnessService::count());

        return 0;
    }
}
