import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function Hybrid() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Hybrid Workforce</h1>
                <p>Benefits that work for remote and on-site teams.</p>
            </div>
            <Footer />
        </>
    );
}
