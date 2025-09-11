<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\CompanyEmployee;
use App\Models\UserMaster;
use App\Models\CompanyUser;

class UpdatePasswords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-passwords';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update passwords from base64 to bcrypt';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->updateTable(CompanyEmployee::class, 'company_employees');
        $this->updateTable(UserMaster::class, 'user_master');
        $this->updateTable(CompanyUser::class, 'company_users');
    }

    private function updateTable($model, $tableName)
    {
        $this->info("Updating passwords for {$tableName}...");
        $model::whereNotNull('pwd')->chunk(1000, function ($users) {
            foreach ($users as $user) {
                try {
                    $this->info("{$user->email}");

                    // Skip if password is empty or already hashed
                    if (empty(trim($user->pwd)) || strpos(trim($user->pwd), '$2y$') === 0) {
                        continue;
                    }

                    $decodedPassword = base64_decode($user->pwd, true);


                    $actualPassword = $decodedPassword;

                    $prefix = 'password';
                    if (strpos($actualPassword, $prefix) === 0) {
                        $actualPassword = substr($actualPassword, strlen($prefix));
                    }

                    $user->pwd = Hash::make($actualPassword);
                    $user->save();
                    $this->info("Password updated {$user->pwd} for user {$actualPassword}");
                } catch (\Exception $e) {
                    $this->error("Could not update password for user ID {$user->id}: " . $e->getMessage());
                }
            }
        });
        $this->info("Finished updating passwords for {$tableName}.");
    }
}
