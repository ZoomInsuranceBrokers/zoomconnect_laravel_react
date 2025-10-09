<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WellnessService extends Model
{
    use HasFactory;

    protected $table = 'wellness_services';

    protected $fillable = [
        'vendor_id',
        'category_id',
        'company_id',
        'wellness_name',
        'icon_url',
        'link',
        'heading',
        'description',
        'status',
    ];

    /**
     * Relationships
     */

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(WellnessCategory::class, 'category_id', 'id');
    }

    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'company_id', 'comp_id');
    }
}
