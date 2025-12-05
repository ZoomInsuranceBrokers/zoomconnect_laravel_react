import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function Employer() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Employer Platform</h1>
                <p>Complete control and insights for HR teams.</p>
            </div>
            <Footer />
        </>
    );
}
