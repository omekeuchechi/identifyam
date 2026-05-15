const TermsAndConditions = () => {
  return (
    <div className="legal-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #ffffff;
          color: #000000;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
          line-height: 1.5;
          font-weight: 400;
        }

        .legal-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        h1 {
          font-size: 1.9rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          border-left: 4px solid #000;
          padding-left: 1rem;
          margin-top: 0;
          margin-bottom: 0.5rem;
        }

        .effective-date {
          font-size: 0.95rem;
          color: #3b3b3b;
          margin-bottom: 2rem;
          border-bottom: 1px solid #eaeef2;
          padding-bottom: 0.75rem;
          display: inline-block;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.8rem 0 0.75rem 0;
          padding-top: 0.5rem;
          border-top: 1px solid #f0f0f0;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1.25rem 0 0.5rem 0;
        }

        p {
          margin-bottom: 1rem;
          font-size: 1rem;
          line-height: 1.55;
          color: #111;
        }

        ul, ol {
          margin: 0.75rem 0 1.2rem 1.8rem;
        }

        li {
          margin-bottom: 0.4rem;
          line-height: 1.5;
        }

        hr {
          margin: 2rem 0;
          border: 0;
          height: 1px;
          background: #e6e9ed;
        }

        .contact-block {
          background-color: #f8f8fa;
          padding: 1.5rem;
          border-radius: 20px;
          margin: 2rem 0 1rem 0;
          border: 1px solid #eceef2;
        }

        .contact-block p {
          margin: 0.3rem 0;
        }

        .contact-block strong {
          font-weight: 600;
        }

        a {
          color: #000;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        a:hover {
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .legal-container {
            padding: 1.5rem 1.2rem;
          }
          h1 {
            font-size: 1.65rem;
          }
          h2 {
            font-size: 1.35rem;
          }
          h3 {
            font-size: 1.15rem;
          }
          ul, ol {
            margin-left: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .legal-container {
            padding: 1.2rem 1rem;
          }
          .contact-block {
            padding: 1rem;
          }
        }
      `}</style>

      <h1>Privacy Policy for Identifyam.com</h1>
      <div className="effective-date">Effective Date: April 1st 2026</div>
      <p>Welcome to Identifyam.com. Your privacy and trust are important to us. This Privacy Policy explains how we collect, use, store, and protect your information when you use our services.</p>

      <h2>1. About Our Services</h2>
      <p>Identifyam.com provides identity-related and educational support services including:<br />
        NIN Slip Retrieval<br />
        NIN Plastic ID Card Processing Assistance<br />
        Examination Scratch Cards (WAEC, NECO, NABTEB, JAMB, etc.) <br />
        Related digital identity and verification support services<br />
        We act as a support and facilitation platform to help users process requests conveniently.</p>

      <h2>2. Information We Collect</h2>
      <p>We may collect the following information:</p>
      <h3>Personal Information</h3>
      <ul>
        <li>Full name</li>
        <li>Phone number</li>
        <li>Email address</li>
        <li>NIN number or tracking information</li>
        <li>Date of birth</li>
        <li>Address</li>
        <li>Uploaded documents or identification records</li>
      </ul>
      <h3>Transaction Information</h3>
      <ul>
        <li>Payment details</li>
        <li>Order history</li>
        <li>Service requests</li>
      </ul>
      <h3>Technical Information</h3>
      <ul>
        <li>IP address</li>
        <li>Browser type</li>
        <li>Device information</li>
        <li>Cookies and usage data</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use your information to:<br />
        Process requested services<br />
        Verify identity information<br />
        Deliver customer support<br />
        Improve website functionality<br />
        Prevent fraud and unauthorized access<br />
        Communicate updates and service notifications<br />
        Comply with legal obligations</p>

      <h2>4. Data Security</h2>
      <p>We implement reasonable administrative, technical, and organizational safeguards to protect user information from:<br />
        Unauthorized access<br />
        Data theft<br />
        Disclosure<br />
        Misuse<br />
        Alteration<br />
        However, no internet transmission or storage system is 100% secure. By using our services, you acknowledge and accept this risk.</p>

      <h2>5. Third-Party Services</h2>
      <p>Some services may involve third-party providers, payment processors, telecom providers, examination bodies, or government-related platforms.<br />
        We are not responsible for:<br />
        Downtime from third-party systems<br />
        Delays caused by external institutions<br />
        Errors originating from third-party databases or government systems<br />
        Users are advised to verify submitted information carefully.</p>

      <h2>6. Data Sharing</h2>
      <p>We do not sell personal information.<br />
        We may share user information only:<br />
        When required by law<br />
        To process requested services<br />
        To comply with lawful investigations<br />
        To protect our legal rights and platform security</p>

      <h2>7. User Responsibilities</h2>
      <p>Users agree to:<br />
        Provide accurate information<br />
        Use the platform lawfully<br />
        Avoid impersonation or fraudulent submissions<br />
        Protect their login credentials<br />
        Users are fully responsible for information submitted through their account.</p>

      <h2>8. Limitation of Liability</h2>
      <p>Identifyam.com shall not be liable for:<br />
        Incorrect information submitted by users<br />
        Delays caused by government systems or third parties<br />
        Temporary website outages<br />
        Losses resulting from unauthorized access beyond reasonable control<br />
        Service interruptions caused by technical issues, cyberattacks, or force majeure events<br />
        To the fullest extent permitted by law, our total liability shall not exceed the amount paid for the specific service in dispute.</p>

      <h2>9. No Government Affiliation Disclaimer</h2>
      <p>Identifyam.com is an independent service platform and is not directly owned, operated, or officially affiliated with NIMC, WAEC, NECO, NABTEB, JAMB, or any Nigerian government agency unless expressly stated.<br />
        All trademarks and organization names belong to their respective owners.</p>

      <h2>10. Data Retention</h2>
      <p>We retain user information only for:<br />
        Service fulfillment<br />
        Legal compliance<br />
        Security and fraud prevention<br />
        Record keeping purposes<br />
        Information may be deleted periodically based on operational needs and applicable laws.</p>

      <h2>11. Cookies Policy</h2>
      <p>Our website may use cookies and analytics tools to:<br />
        Improve user experience<br />
        Monitor traffic<br />
        Enhance website performance<br />
        Users may disable cookies through browser settings.</p>

      <h2>12. Children’s Privacy</h2>
      <p>Our services are not intentionally directed to children under 13 without parental or guardian supervision.</p>

      <h2>13. Indemnification</h2>
      <p>By using Identifyam.com, users agree to indemnify and hold harmless Identifyam.com, its owners, staff, and partners against claims, liabilities, damages, or legal disputes arising from:<br />
        False submissions<br />
        Misuse of the platform<br />
        Violation of laws<br />
        Unauthorized use of another person’s information</p>

      <h2>14. Service Availability</h2>
      <p>We reserve the right to:<br />
        Modify services<br />
        Suspend accounts<br />
        Refuse service<br />
        Update pricing<br />
        Restrict access for suspicious activities<br />
        without prior notice where necessary.</p>

      <h2>15. Changes to This Policy</h2>
      <p>We may update this Privacy Policy and Terms periodically. Continued use of the website after updates means acceptance of the revised terms.</p>

      <h2>16. Contact Information</h2>
      <p>For inquiries or complaints, contact:<br />
        Website: Identifyam.com<br />
        Email: support@identifyam.com<br />
        Phone: +234 815 300 6465</p>

      <hr />

      <h1>Terms &amp; Conditions for Identifyam.com</h1>
      <div className="effective-date">Effective Date: April 1st 2026</div>
      <p>By accessing or using Identifyam.com, you agree to these Terms and Conditions.</p>

      <h2>1. Acceptance of Terms</h2>
      <p>Using this platform confirms that you:<br />
        Are legally capable of entering agreements<br />
        Agree to comply with applicable laws<br />
        Accept these terms fully</p>

      <h2>2. Nature of Services</h2>
      <p>Identifyam.com provides assistance and facilitation services for:<br />
        NIN-related support<br />
        Identity document retrieval assistance<br />
        Examination scratch cards<br />
        Related digital services<br />
        We do not guarantee approval, issuance, or processing timelines controlled by third parties or government agencies.</p>

      <h2>3. Payments and Refunds</h2>
      <p>Payments made for completed digital services are generally non-refundable.<br />
        Refunds may only apply where services were not rendered due to our verified fault.<br />
        Users must review submitted details carefully before payment.</p>

      <h2>4. Prohibited Activities</h2>
      <p>Users shall not:<br />
        Use stolen identities<br />
        Submit false information<br />
        Attempt unauthorized access<br />
        Engage in fraud or cyber abuse<br />
        Disrupt website operations<br />
        Violations may result in account suspension and legal reporting.</p>

      <h2>5. Intellectual Property</h2>
      <p>All branding, logos, website content, graphics, and materials on Identifyam.com remain the intellectual property of the platform unless otherwise stated.<br />
        Unauthorized reproduction is prohibited.</p>

      <h2>6. Disclaimer of Warranties</h2>
      <p>Services are provided “as is” and “as available.”<br />
        We make no warranties regarding:<br />
        Continuous availability<br />
        Error-free operation<br />
        Third-party system reliability<br />
        Government platform uptime</p>

      <h2>7. Governing Law</h2>
      <p>These Terms shall be governed by the laws of the Federal Republic of Nigeria.<br />
        Any disputes shall be resolved under Nigerian jurisdiction.</p>

      <h2>8. Termination</h2>
      <p>We reserve the right to suspend or terminate access where:<br />
        Fraud is suspected<br />
        Terms are violated<br />
        Security risks are identified</p>

      <h2>9. Consent</h2>
      <p>By using Identifyam.com, users consent to:<br />
        Collection and processing of submitted information<br />
        Communication regarding requested services<br />
        Security monitoring and fraud prevention activities</p>

      <h2>10. Contact</h2>
      <p>Website: Identifyam.com<br />
        Email: support@identifyam.com<br />
        Phone: +234 815 300 6465</p>

      <div className="contact-block">
        <p><strong>Get in touch</strong><br />If you have any questions about our Privacy Policy or Terms, feel free to reach out:</p>
        <p>Identifyam.com &nbsp;|&nbsp;  <a href="mailto:support@identifyam.com">support@identifyam.com</a> &nbsp;|&nbsp; +234 815 300 6465</p>
      </div>
      <p style={{ fontSize: "0.8rem", textAlign: "center", marginTop: "2rem", color: "#4a4f56" }}>© 2026 Identifyam.com — All rights reserved.</p>
    </div>
  );
};

export default TermsAndConditions;