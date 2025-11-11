import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function LargeTeams() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Large Enterprises</h1>
                <p>Scalable solutions for large organizations.</p>
            </div>
            <Footer />
        </>
    );
}
