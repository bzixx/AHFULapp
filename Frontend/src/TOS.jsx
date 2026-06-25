import React from "react";
import "./siteStyles.css";

export function TOS({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="tos-modal" onClick={handleBackdropClick}>
      <div className="tos-modal-content">
        <button className="tos-close" onClick={onClose}>
          × 
        </button>
                <h1>Terms of Service</h1>

                <p className="tos-intro">
                    These Terms of Service ("Terms") govern your access to and use of the AHFUL app and related services (the "Service"). By accessing or using the Service you agree to be bound by these Terms. If you do not agree to all of the terms, then you may not access the Service.
                </p>

                <h2>This website is a UW-Stout Student Open Source Group Project for the 2026-2027 Academic Year</h2>
                <p>
                    The authors of this website are students at the University of Wisconsin-Stout implementing their advanced software engineering skills to show off the functional secure website they have built over the semester.
                </p>

                <h2>1. Using the Service</h2>
                <p>
                    You may use the Service only in compliance with these Terms and all applicable local, state, and federal laws applicaable in your region's jurisdiction. You are responsible for any activity that occurs under your account.
                </p>

                <h2>2. AHFUL Accounts</h2>
                <p>
                    Most features require an account. In order to create an AHFUL account you must:  
                        A)Have an active Google account in good standing with Google.  
                        AND
                        B)Allow AHFUL app to access your basic Google account information such as name, email, and profile picture. 
                </p>

                <h2>2.1 Account Security</h2>
                <p>
                    You are responsible for all activity on your account. We may deactivate your account if you violate these Terms. You are responsible for maintaining the security of your account. We cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                </p>

                <h2>3. Content</h2>
                <p>
                    You retain ownership of content you submit to the Service. By submitting content you grant the Service a limited license to store, display, and transmit that content as necessary to provide the Service.
                </p>

                <h2>4. Prohibited Conduct</h2>
                <p>
                    Do not use the Service for illegal activities, harassment, distributing malware, or infringing others' rights. We reserve the right to remove content and restrict accounts for violations.
                </p>

                <h2>5. Third-Party Links and Integrations</h2>
                <p>
                    The Service may contain links or integrations with third-party services. We are not responsible for third-party content or practices. Your interactions with third parties are solely between you and the third party.
                </p>

                <h2>6. Disclaimers</h2>
                <p>
                    THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.
                </p>

                <h2>7. Limitation of Liability</h2>
                <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE SERVICE.
                </p>

                <h2>8. Changes to These Terms</h2>
                <p>
                    We may update these Terms from time to time. If we make material changes we will provide notice. Continued use of the Service after changes constitutes acceptance of the updated Terms.
                </p>

                <h2>9. Contact</h2>
                <p>
                    If you have questions about these Terms, please contact the app owners or maintainers as described on the project repository.
                </p>

                <h2>10. Contact</h2>
                <p>
                The Gemini API Additional Terms of Service and the Google Privacy Policy apply. Prompts and responses may be reviewed and used to train Google AI, so don’t submit sensitive or personal information. Learn more about data use. Google AI models can make mistakes, so double-check responses before relying on, publishing, or otherwise using generated content.
                </p>
        <p className="tos-last-updated">Last updated: April 9, 2026</p>
      </div>
    </div>
  );
}

