import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function Employee() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Employee Platform</h1>
                <p>Easy-to-use dashboard for managing benefits.</p>
            </div>
            <Footer />
        </>
    );
}
