import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function Careers() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Careers</h1>
                <p>Join our growing team of professionals.</p>
            </div>
            <Footer />
        </>
    );
}
