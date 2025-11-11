import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function Mobile() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Mobile App</h1>
                <p>Access your benefits on the go with our app.</p>
            </div>
            <Footer />
        </>
    );
}
