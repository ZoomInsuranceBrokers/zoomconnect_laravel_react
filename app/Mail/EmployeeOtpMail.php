<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmployeeOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $email;
    public $employeeName;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($otp, $email, $employeeName = null)
    {
        $this->otp = $otp;
        $this->email = $email;
        $this->employeeName = $employeeName;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('ZoomConnect Employee Portal - Login Verification Code')
                    ->view('emails.otp')
                    ->with([
                        'otp' => $this->otp,
                        'email' => $this->email,
                        'employeeName' => $this->employeeName,
                    ]);
    }
}