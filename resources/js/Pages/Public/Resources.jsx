import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function Resources() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Resources</h1>
                <p>Guides, whitepapers, and helpful materials.</p>
            </div>
            <Footer />
        </>
    );
}
