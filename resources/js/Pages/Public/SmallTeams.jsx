import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function SmallTeams() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Small Teams</h1>
                <p>Flexible plans designed for startups and SMEs.</p>
            </div>
            <Footer />
        </>
    );
}
