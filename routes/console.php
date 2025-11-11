<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

// Schedule tpanetworkhospitalupdate to run daily at midnight
Artisan::command('schedule:console', function () {
    \Illuminate\Support\Facades\Schedule::command('tpanetworkhospitalupdate')->dailyAt('00:00');
});

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
