import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function Contact() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Contact</h1>
                <p>Get in touch with our team.</p>
            </div>
            <Footer />
        </>
    );
}
