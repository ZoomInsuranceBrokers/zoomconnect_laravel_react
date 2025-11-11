import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function Cases() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Case Studies</h1>
                <p>Success stories from our clients.</p>
            </div>
            <Footer />
        </>
    );
}
