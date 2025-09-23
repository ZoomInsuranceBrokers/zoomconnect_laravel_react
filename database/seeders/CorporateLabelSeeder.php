<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CorporateLabel;
use Carbon\Carbon;

class CorporateLabelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $labels = [
            [
                'label' => 'Automobile',
                'remark' => 'Companies involved in manufacturing, selling, or servicing vehicles',
                'is_active' => true,
            ],
            [
                'label' => 'Finance',
                'remark' => 'Financial institutions, banks, investment companies, and related services',
                'is_active' => true,
            ],
            [
                'label' => 'Manufacturing',
                'remark' => 'Companies engaged in the production of goods and products',
                'is_active' => true,
            ],
            [
                'label' => 'Information Technology',
                'remark' => 'Software development, IT services, and technology companies',
                'is_active' => true,
            ],
            [
                'label' => 'Healthcare',
                'remark' => 'Hospitals, pharmaceutical companies, and healthcare service providers',
                'is_active' => true,
            ],
            [
                'label' => 'Education',
                'remark' => 'Educational institutions, training centers, and e-learning platforms',
                'is_active' => true,
            ],
            [
                'label' => 'Real Estate',
                'remark' => 'Property development, real estate agencies, and construction companies',
                'is_active' => true,
            ],
            [
                'label' => 'Retail',
                'remark' => 'Retail stores, e-commerce platforms, and consumer goods companies',
                'is_active' => true,
            ],
            [
                'label' => 'Telecommunications',
                'remark' => 'Telecom service providers, internet services, and communication companies',
                'is_active' => true,
            ],
            [
                'label' => 'Energy',
                'remark' => 'Oil, gas, renewable energy, and utility companies',
                'is_active' => true,
            ],
            [
                'label' => 'Food & Beverage',
                'remark' => 'Food processing, restaurants, beverage companies, and hospitality',
                'is_active' => true,
            ],
            [
                'label' => 'Transportation & Logistics',
                'remark' => 'Shipping, logistics, airlines, and transportation service providers',
                'is_active' => true,
            ],
            [
                'label' => 'Media & Entertainment',
                'remark' => 'Broadcasting, film production, gaming, and entertainment companies',
                'is_active' => true,
            ],
            [
                'label' => 'Textiles & Apparel',
                'remark' => 'Clothing manufacturers, textile companies, and fashion brands',
                'is_active' => true,
            ],
            [
                'label' => 'Agriculture',
                'remark' => 'Farming, agricultural equipment, and agribusiness companies',
                'is_active' => true,
            ],
            [
                'label' => 'Chemicals & Pharmaceuticals',
                'remark' => 'Chemical manufacturing, pharmaceutical companies, and related industries',
                'is_active' => true,
            ],
            [
                'label' => 'Government',
                'remark' => 'Government agencies, public sector organizations, and municipal corporations',
                'is_active' => true,
            ],
            [
                'label' => 'Non-Profit',
                'remark' => 'NGOs, charitable organizations, and non-profit institutions',
                'is_active' => true,
            ],
            [
                'label' => 'Consulting',
                'remark' => 'Management consulting, business advisory, and professional services',
                'is_active' => true,
            ],
            [
                'label' => 'Others',
                'remark' => 'Companies that do not fit into the above categories',
                'is_active' => true,
            ],
        ];

        foreach ($labels as $label) {
            CorporateLabel::create([
                'label' => $label['label'],
                'remark' => $label['remark'],
                'is_active' => $label['is_active'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
