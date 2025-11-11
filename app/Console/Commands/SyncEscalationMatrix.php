<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncEscalationMatrix extends Command
{
    protected $signature = 'sync:escalation-matrix';
    protected $description = 'Copy escalation matrix users to escalation_users and update policy_master table';

    public function handle()
    {
        $this->info('Starting escalation matrix sync...');

        $records = DB::table('escalation_matrix')->get();

        foreach ($records as $record) {
            DB::beginTransaction();
            try {
                // Find or create escalation user
                $existingUser = DB::table('escalation_users')->where('email', $record->email_id)->first();

                if ($existingUser) {
                    $userId = $existingUser->id;
                    $this->info("Existing user found: {$record->email_id}");
                } else {
                    $userId = DB::table('escalation_users')->insertGetId([
                        'name' => $record->full_name,
                        'email' => $record->email_id,
                        'mobile' => $record->mobile,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $this->info("New user created: {$record->email_id}");
                }

                // Normalize matrix type
                $matrix = strtolower($record->matrix);
                $updateFields = [];

                if (str_contains($matrix, 'data')) {
                    $updateFields['data_escalation_id'] = $userId;
                } elseif (
                    str_contains($matrix, 'claim l1') ||
                    str_contains($matrix, 'level 1') ||
                    str_contains($matrix, 'l-1') ||
                    str_contains($matrix, 'claim level 1')
                ) {
                    $updateFields['claim_level_1_id'] = $userId;
                } elseif (
                    str_contains($matrix, 'claim l2') ||
                    str_contains($matrix, 'level 2') ||
                    str_contains($matrix, 'l-2') ||
                    str_contains($matrix, 'claim level 2')
                ) {
                    $updateFields['claim_level_2_id'] = $userId;
                }

                // Update policy_master if applicable
                if (!empty($updateFields)) {
                    DB::table('policy_master')
                        ->where('id', $record->policy_id)
                        ->update($updateFields);

                    $this->info("Policy ID {$record->policy_id} updated with " . json_encode($updateFields));
                } else {
                    $this->warn("No matching matrix type found for record ID {$record->id}");
                }

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                $this->error("Error processing record ID {$record->id}: " . $e->getMessage());
            }
        }

        $this->info('Escalation matrix sync completed successfully!');
    }
}
