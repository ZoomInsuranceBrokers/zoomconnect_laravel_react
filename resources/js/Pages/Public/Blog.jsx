import React from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function Blog() {
    return (
        <>
            <Header />
            <div className="container mx-auto py-16">
                <h1 className="text-4xl font-bold mb-4">Blog</h1>
                <p>Latest insights on employee benefits and wellness.</p>
            </div>
            <Footer />
        </>
    );
}
