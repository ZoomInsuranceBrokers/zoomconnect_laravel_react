<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('endorsement_data', function (Blueprint $table) {
            $table->renameColumn('uhid_id', 'uhid');
        });
    }

    public function down(): void
    {
        Schema::table('endorsement_data', function (Blueprint $table) {
            $table->renameColumn('uhid', 'uhid_id');
        });
    }
};
