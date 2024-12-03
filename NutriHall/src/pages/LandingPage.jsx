import React from 'react';
import LP_Navbar from '../components/LP_Navbar';
import LP_Title from '../components/LP_Title';
import LP_Features from '../components/LP_Features';
import LP_Glance from '../components/LP_Glance';
import LP_Footer from '../components/LP_Footer';
import "../styles/LandingPage.css"

const LandingPage = () => {
    return(
        <div>
            <LP_Navbar />
            <div className="max-w-7xl-auto pt-20 px-6">
                <LP_Title />
                <section id = "features"><LP_Features /></section>
                <section id = "glance"><LP_Glance /></section>
                <LP_Footer />
            </div>
        </div>
    );
};

export default LandingPage;
