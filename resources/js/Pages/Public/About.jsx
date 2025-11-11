import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function About() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">About Us</h1>
                <p>Learn about our mission and values.</p>
            </div>
            <Footer />
        </>
    );
}
