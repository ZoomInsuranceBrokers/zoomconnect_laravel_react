import React from 'react';
import { Head } from '@inertiajs/react';
import EmployeeLoginComponent from '../../Components/EmployeeLogin';

export default function Login() {
    return (
        <>
            <Head title="Employee Login - ZoomConnect" />
            <EmployeeLoginComponent />
        </>
    );
}
