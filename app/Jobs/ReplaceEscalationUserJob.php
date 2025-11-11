<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReplaceEscalationUserJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $oldUserId;
    public $newUserId;

    /**
     * Create a new job instance.
     */
    public function __construct($oldUserId, $newUserId)
    {
        $this->oldUserId = $oldUserId;
        $this->newUserId = $newUserId;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        try {
            // Update policy_master in a single query for each column
            DB::table('policy_master')
                ->where('data_escalation_id', $this->oldUserId)
                ->update(['data_escalation_id' => $this->newUserId]);

            DB::table('policy_master')
                ->where('claim_level_1_id', $this->oldUserId)
                ->update(['claim_level_1_id' => $this->newUserId]);

            DB::table('policy_master')
                ->where('claim_level_2_id', $this->oldUserId)
                ->update(['claim_level_2_id' => $this->newUserId]);

            Log::info('ReplaceEscalationUserJob: replaced user '.$this->oldUserId.' with '.$this->newUserId);
        } catch (\Exception $e) {
            Log::error('ReplaceEscalationUserJob failed: '.$e->getMessage());
            // optionally rethrow to let the queue retry
            throw $e;
        }
    }
}
