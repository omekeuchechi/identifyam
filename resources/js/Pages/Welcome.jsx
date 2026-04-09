import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import '../../css/home.css'
import '../../css/custom.css'

// image imporsts
import logo from '../../assets/svg/identifyam_logo.svg';
import heroImage from '../../assets/img/img.png';
import secureIcon from '../../assets/svg/secure_processing.svg';
import fastIcon from '../../assets/svg/fast_processing_support_icon.svg';
import coverageIcon from '../../assets/svg/nationwide_diaspora_coverage_icon.svg';
import educationTravelIcon from '../../assets/svg/education_travel_abroad_services.svg';
import CACIcon from '../../assets/svg/CAC_ICON.svg';
import secureAndConfidenIcon from "../../assets/svg/secure_and_confidential_icon.svg";
import fastProcessingIcon from "../../assets/svg/fast_processing_support_icon.svg";
import nationalDiasporaIcon from "../../assets/svg/nationwide_diaspora_coverage_icon.svg";
import verifySupportIcon from "../../assets/svg/verify_support.svg";
import faceBookIcon from "../../assets/svg/facebook_icon.svg";
import twitterIcon from "../../assets/svg/tiw.svg";
import instagramIcon from "../../assets/svg/instagram_icon.svg";
import eIcon from "../../assets/svg/eicon.svg";
import greenShieldIcon from "../../assets/svg/green_shield_icon.svg";

import downloadIcon from '../../assets/img/download_icon.png';
import fileIcon from '../../assets/img/file.png';
import gearIcon from '../../assets/img/gear.png';
import whatsappIcon from '../../assets/img/whap.png';
import phoneIcon from '../../assets/img/phone.png';
import liveChatIcon from '../../assets/img/live_chat_icon.png';
import redEmailIcon from '../../assets/img/red_email.png';

// animated image
import idCardImage from '../../assets/img/id_card.png';



export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    // Scroll-based fade animation
    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll('.fade-in-scroll');
            const triggerBottom = window.innerHeight * 0.8;

            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;

                if (elementTop < triggerBottom) {
                    element.classList.add('fade-in-visible');
                } else {
                    element.classList.remove('fade-in-visible');
                }
            });
        };

        // Initial check
        handleScroll();

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scroll function
    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const element = document.querySelector(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Add loading animation on mount
    useEffect(() => {
        document.body.classList.add('loaded');
        return () => {
            document.body.classList.remove('loaded');
        };
    }, []);

    return (
        <>
            <Head title="Welcome" />

            {/* Skip to content link for accessibility */}
            <a href="#home" className="skip-to-content" onClick={(e) => scrollToSection(e, '#home')}>Skip to main content</a>

            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <Link href="/" className="logo">
                            <img src={logo} alt="IdentifyAM" loading="lazy" style={{
                                background: '#059669',
                                padding: '10px',
                                borderRadius: '5px'
                            }} />
                            IdentifyAM
                        </Link>
                        <nav>
                            <ul className="nav-links">
                                <li><a href="#home" onClick={(e) => scrollToSection(e, '#home')}>NIN Services</a></li>
                                <li><a href="#services" onClick={(e) => scrollToSection(e, '#services')}>CAC Registration</a></li>
                                <li><a href="#about" onClick={(e) => scrollToSection(e, '#about')}>Education Travel</a></li>
                                <li><a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>Contact</a></li>
                                {auth.user ? (
                                    auth.user.isAdmin ? (
                                        <li><a href={route('admin.dashboard')}>Management</a></li>
                                    ) : (
                                        <li><a href={route('dashboard')}>Dashboard</a></li>
                                    )
                                ) : (
                                    <>
                                        <li><a href="login">Login</a></li>
                                        <li><a href="register">Register</a></li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero fade-in-scroll" id="home">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text fade-in-scroll">
                            <h1 className="fade-in-scroll">Retrieve Your <span style={{ color: '#059669' }}>NIN
                                Slip</span> Fast & Securely</h1>
                            <p className="fade-in-scroll">Lost your NIN slip? Get it retrieved quickly with secure and
                                professional support</p>
                            <div className="hero-buttons fade-in-scroll">
                                <Link href={route('login')} className="btn-get-started">
                                    <img src={logo} alt="IdentifyAM" loading="lazy" />
                                    <span>Get Your NIN Slip</span>
                                </Link>
                            </div>
                            <div className="hero-features fade-in-scroll">
                                <div className="hero-feature fade-in-scroll">
                                    <img src={secureIcon} alt="Secure" loading="lazy" />
                                    <span>Secure Processing</span>
                                </div>
                                <div className="hero-feature fade-in-scroll">
                                    <img src={fastIcon} alt="Fast" loading="lazy" />
                                    <span>Fast & Verifield Results</span>
                                </div>
                                <div className="hero-feature fade-in-scroll">
                                    <img src={coverageIcon} alt="Coverage" loading="lazy" />
                                    <span>Confidential Handling</span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-image fade-in-scroll">
                            <img src={heroImage} alt="NIN Verification Service" loading="eager" />
                        </div>
                        <div className="id-card-animation hero-content-animation">
                            {Array.from({ length: 20 }, (_, i) => (
                                <img
                                    key={i}
                                    src={idCardImage}
                                    alt="ID Card"
                                    className={`id-card-drop-small id-card-${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works fade-in-scroll" id="process">
                <div className="container">
                    <div className="section-header fade-in-scroll">
                        <h2 className="fade-in-scroll">How It Works</h2>
                        <p className="fade-in-scroll">Simple, secure process to get your NIN slip retrieved</p>
                    </div>
                    <div className="process-grid">
                        <div className="process-item fade-in-scroll">
                            <div className="process-icon fade-in-scroll">
                                <img src={fileIcon} alt="Submit Details" loading="lazy" />
                            </div>
                            <h3 className="fade-in-scroll">Submit Your Details</h3>
                            <p className="fade-in-scroll">Provide your NIN and required information through our secure platform</p>
                        </div>
                        <div className="process-item fade-in-scroll">
                            <div className="process-icon fade-in-scroll">
                                <img src={gearIcon} alt="Process & Retrieve" loading="lazy" />
                            </div>
                            <h3 className="fade-in-scroll">We Process & Retrieve</h3>
                            <p className="fade-in-scroll">Our team securely processes your request and retrieves your NIN slip</p>
                        </div>
                        <div className="process-item fade-in-scroll">
                            <div className="process-icon fade-in-scroll">
                                <img src={downloadIcon} alt="Receive Results" loading="lazy" />
                            </div>
                            <h3 className="fade-in-scroll">Receive Your NIN Slip</h3>
                            <p className="fade-in-scroll">Get your official NIN slip delivered securely to your preferred method</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services fade-in-scroll" id="services">
                <div className="container">
                    <div className="section-header fade-in-scroll">
                        <h2>Other Services We Offer</h2>
                    </div>
                    <div className="services-grid fade-in-scroll">

                        <div className="service-card fade-in-scroll">
                            <div className="service-icon fade-in-scroll">
                                <img src={CACIcon} alt="Documentation" loading="lazy" />
                                <span>CAC Business Registration</span>
                            </div>
                            <p className='fade-in-scroll'>Professional assistance with NIN documentation and application processes</p>
                            <button className="contact-support-btn fade-in-scroll"><img src={phoneIcon} alt="" loading='lazy' />Contact Support</button>
                            <div className="contact-options fade-in-scroll">
                                <a href="https://wa.me/2348000000000" className="contact-btn whatsapp">
                                    <img src={whatsappIcon} alt="WhatsApp" loading="lazy" />
                                    WhatsApp
                                </a>
                                <a href="#" className="contact-btn call fade-in-scroll">
                                    <img src={phoneIcon} alt="Call" loading="lazy" />
                                    Call
                                </a>
                                <a href="#" className="contact-btn chat fade-in-scroll">
                                    <img src={liveChatIcon} alt="Live Chat" loading="lazy" />
                                    Live Chat
                                </a>
                            </div>
                        </div>

                        <div className="service-card fade-in-scroll">
                            <div className="service-icon fade-in-scroll">
                                <img src={educationTravelIcon} alt="Education & Travel" loading="lazy" />
                                <span>Education & Travel Abroad Services</span>
                            </div>
                            <p className='fade-in-scroll'>NIN verification for educational institutions and international travel requirements</p>
                            <button className="contact-support-btn fade-in-scroll"><img src={phoneIcon} alt="" loading='lazy' />Contact Support</button>
                            <div className="contact-options fade-in-scroll">
                                <a href="https://wa.me/2348000000000" className="contact-btn whatsapp fade-in-scroll">
                                    <img src={whatsappIcon} alt="WhatsApp" loading="lazy" />
                                    WhatsApp
                                </a>
                                <a href="mailto:identifyam@gmail.com" className="contact-btn email fade-in-scroll">
                                    <img src={redEmailIcon} alt="email" loading="lazy" />
                                    Email
                                </a>
                                <a href="tel:+2348000000000" className="contact-btn call fade-in-scroll">
                                    <img src={phoneIcon} alt="Call" loading="lazy" />
                                    Call
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose fade-in-scroll" id="about">
                <div className="container">
                    <div className="section-header fade-in-scroll">
                        <h2 className='fade-in-scroll'>Why Choose IdentifyAM</h2>
                        <p className='fade-in-scroll'>Your trusted partner for identity verification</p>
                    </div>
                    <div className="why-grid fade-in-scroll">
                        <div className="why-item fade-in-scroll">
                            <div className="why-icon fade-in-scroll">
                                <img src={secureAndConfidenIcon} alt="Secure" loading="lazy" />
                            </div>
                            <h3>Secure & Confidential</h3>
                            <p>Your data is protected with industry-standard security measures</p>
                        </div>
                        <div className="why-item fade-in-scroll">
                            <div className="why-icon fade-in-scroll">
                                <img src={fastProcessingIcon} alt="Fast" loading="lazy" />
                            </div>
                            <h3>Fast Processing</h3>
                            <p>Quick turnaround times for all verification requests</p>
                        </div>
                        <div className="why-item fade-in-scroll">
                            <div className="why-icon fade-in-scroll">
                                <img src={nationalDiasporaIcon} alt="Coverage" loading="lazy" />
                            </div>
                            <h3>Nationwide Coverage</h3>
                            <p>Services available across all states and for diaspora</p>
                        </div>
                        <div className="why-item fade-in-scroll">
                            <div className="why-icon fade-in-scroll">
                                <img src={verifySupportIcon} alt="Support" loading="lazy" />
                            </div>
                            <h3 className='fade-in-scroll'>24/7 Support</h3>
                            <p className='fade-in-scroll'>Round-the-clock customer assistance for all your needs</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq fade-in-scroll" id="faq">
                <div className="container">
                    <div className="section-header fade-in-scroll">
                        <h2>Frequently Asked Questions</h2>
                        <p>Common questions about our services</p>
                    </div>
                    <div className="faq-container fade-in-scroll">
                        <div className="faq-item fade-in-scroll">
                            <div className="faq-question fade-in-scroll"
                                onClick={(e) => {
                                    const faqItem = e.currentTarget.parentElement;
                                    const isActive = faqItem.classList.contains('active');

                                    // Close all other FAQ items
                                    document.querySelectorAll('.faq-item').forEach(item => {
                                        item.classList.remove('active');
                                    });

                                    // Toggle current item
                                    if (!isActive) {
                                        faqItem.classList.add('active');
                                    }
                                }}
                                tabIndex="0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.currentTarget.click();
                                    }
                                }}>
                                What is NIN verification?
                                <span className="faq-toggle" aria-hidden="true">+</span>
                            </div>
                            <div className="faq-answer">
                                NIN verification is the process of confirming the authenticity of a National Identification Number through official government databases. This service helps individuals and organizations verify identity information for various purposes.
                            </div>
                        </div>
                        <div className="faq-item fade-in-scroll">
                            <div className="faq-question fade-in-scroll"
                                onClick={(e) => {
                                    const faqItem = e.currentTarget.parentElement;
                                    const isActive = faqItem.classList.contains('active');

                                    // Close all other FAQ items
                                    document.querySelectorAll('.faq-item').forEach(item => {
                                        item.classList.remove('active');
                                    });

                                    // Toggle current item
                                    if (!isActive) {
                                        faqItem.classList.add('active');
                                    }
                                }}
                                tabIndex="0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.currentTarget.click();
                                    }
                                }}>
                                How long does the verification process take?
                                <span className="faq-toggle" aria-hidden="true">+</span>
                            </div>
                            <div className="faq-answer">
                                Standard verification typically takes 24-48 hours. However, processing time may vary depending on server availability and the completeness of your submitted information.
                            </div>
                        </div>
                        <div className="faq-item fade-in-scroll">
                            <div className="faq-question fade-in-scroll"
                                onClick={(e) => {
                                    const faqItem = e.currentTarget.parentElement;
                                    const isActive = faqItem.classList.contains('active');

                                    // Close all other FAQ items
                                    document.querySelectorAll('.faq-item').forEach(item => {
                                        item.classList.remove('active');
                                    });

                                    // Toggle current item
                                    if (!isActive) {
                                        faqItem.classList.add('active');
                                    }
                                }}
                                tabIndex="0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.currentTarget.click();
                                    }
                                }}>
                                Is my personal information secure?
                                <span className="faq-toggle" aria-hidden="true">+</span>
                            </div>
                            <div className="faq-answer">
                                Yes, we use industry-standard encryption and security protocols to protect your personal information. All data is transmitted securely and stored in compliance with data protection regulations.
                            </div>
                        </div>
                        <div className="faq-item fade-in-scroll">
                            <div className="faq-question fade-in-scroll"
                                onClick={(e) => {
                                    const faqItem = e.currentTarget.parentElement;
                                    const isActive = faqItem.classList.contains('active');

                                    // Close all other FAQ items
                                    document.querySelectorAll('.faq-item').forEach(item => {
                                        item.classList.remove('active');
                                    });

                                    // Toggle current item
                                    if (!isActive) {
                                        faqItem.classList.add('active');
                                    }
                                }}
                                tabIndex="0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.currentTarget.click();
                                    }
                                }}>
                                What documents do I need for verification?
                                <span className="faq-toggle" aria-hidden="true">+</span>
                            </div>
                            <div className="faq-answer">
                                You'll need your 11-digit NIN number, a valid form of identification (such as a driver's license or international passport), and a recent passport photograph.
                            </div>
                        </div>

                        <div className="faq-item fade-in-scroll">
                            <div className="faq-question fade-in-scroll"
                                onClick={(e) => {
                                    const faqItem = e.currentTarget.parentElement;
                                    const isActive = faqItem.classList.contains('active');

                                    // Close all other FAQ items
                                    document.querySelectorAll('.faq-item').forEach(item => {
                                        item.classList.remove('active');
                                    });

                                    // Toggle current item
                                    if (!isActive) {
                                        faqItem.classList.add('active');
                                    }
                                }}
                                tabIndex="0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.currentTarget.click();
                                    }
                                }}>
                                How will I receive my slip?
                                <span className="faq-toggle" aria-hidden="true">+</span>
                            </div>
                            <div className="faq-answer">
                                You can receive your NIN slip via secure email, WhatsApp, or physical delivery based on your preference.
                            </div>
                        </div>

                        <div className="faq-item fade-in-scroll">
                            <div className="faq-question fade-in-scroll"
                                onClick={(e) => {
                                    const faqItem = e.currentTarget.parentElement;
                                    const isActive = faqItem.classList.contains('active');

                                    // Close all other FAQ items
                                    document.querySelectorAll('.faq-item').forEach(item => {
                                        item.classList.remove('active');
                                    });

                                    // Toggle current item
                                    if (!isActive) {
                                        faqItem.classList.add('active');
                                    }
                                }}
                                tabIndex="0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.currentTarget.click();
                                    }
                                }}>
                                How do I contact support for CAC or Education Travel?
                                <span className="faq-toggle" aria-hidden="true">+</span>
                            </div>
                            <div className="faq-answer">
                                Use the contact support buttons in their respective sections, or reach out via WhatsApp, phone, or email for personalized assistance.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta fade-in-scroll">
                <div className="container">
                    <h2 className='fade-in-scroll'>Don't Delay. Retrieve Your NIN Slip Today.</h2>
                    <a href="#services" onClick={(e) => scrollToSection(e, '#services')} className="btn-primary fade-in-scroll"><img src={greenShieldIcon} alt="" /> Get Your NIN Slip</a>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer fade-in-scroll" id="contact">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-column">
                            <h3>About IdentifyAM</h3>
                            <p>Your trusted partner for professional NIN verification and identity services in Nigeria. We provide secure, fast, and reliable solutions for individuals and organizations.</p>
                            <div className="social-links">
                                <a href="#" aria-label="Facebook"><img src={faceBookIcon} alt="" /></a>
                                <a href="#" aria-label="Twitter"><img src={twitterIcon} alt="" /></a>
                                <a href="#" aria-label="Instagram"><img src={instagramIcon} alt="" /></a>
                            </div>
                        </div>
                        <div className="footer-column">
                            <h3>Quick Links</h3>
                            <ul className="footer-links">
                                <li><a href="#home" onClick={(e) => scrollToSection(e, '#home')}>Home</a></li>
                                <li><a href="#services" onClick={(e) => scrollToSection(e, '#services')}>Services</a></li>
                                <li><a href="#about" onClick={(e) => scrollToSection(e, '#about')}>About Us</a></li>
                                <li><a href="#faq" onClick={(e) => scrollToSection(e, '#faq')}>FAQ</a></li>
                                <li><a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>Contact</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>Services</h3>
                            <ul className="footer-links">
                                <li><a href="#services" onClick={(e) => scrollToSection(e, '#services')}>NIN Services</a></li>
                                <li><a href="#services" onClick={(e) => scrollToSection(e, '#services')}>CAC Service</a></li>
                                <li><a href="#services" onClick={(e) => scrollToSection(e, '#services')}>Education Travel</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>Contact Info</h3>
                            <ul className="contact-info">
                                <li>
                                    <img src={phoneIcon} alt="Phone" loading="lazy" />
                                    <span>+234 903 005 7489</span>
                                </li>
                                <li>
                                    <img src={eIcon} alt="Email" loading="lazy" />
                                    <span>support@identifyam.com</span>
                                </li>
                                <li>
                                    <img src={whatsappIcon} alt="WhatsApp" loading="lazy" />
                                    <span>+234 903 005 7489</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 IdentifyAM. All rights reserved. | Privacy Policy | Terms of Service</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
