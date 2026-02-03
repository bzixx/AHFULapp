import { useState, useRef } from 'react';
import '../../../siteStyles.css'
import {sendEmail} from '../../../services/emailApi.js'

export default function EmailComponent(){
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [EmailLoading, setEmailLoading] = useState(false);
    const [attachPDF, setAttachPDF] = useState(false);
    const [attachment, setAttchment] = useState(null);
    const fileInputRef = useRef(null);

    const handleSendEmail = async () => {
        if (!recipient || !subject || !body) {
            alert('Please fill in all fields');
            return;
        }

        const emailData = {
            subject: subject,
            recipient: recipient,
            body: body,
            attachment: attachment
        };

        try {
            setEmailLoading(true);
            await sendEmail(emailData);
            alert('Email sent successfully!');
            
            setRecipient('');
            setSubject('');
            setBody('');
        } catch (error) {
            console.error('Failed to send email:', error);
            alert('Failed to send email. Please try again.');
        } finally {
            setEmailLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAttchment(file);
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    return(
        <div className="graph-controls email-container">
            <div className="email-card">
                <h3>Send Email Report</h3>
                
                <div className="email-form-group">
                    <label htmlFor="email-recipient">Recipient Email:</label>
                    <input
                        type="email"
                        id="email-recipient"
                        className="email-input"
                        placeholder="Enter recipient email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                </div>
                
                <div className="email-form-group">
                    <label htmlFor="email-subject">Email Subject:</label>
                    <input
                        type="text"
                        id="email-subject"
                        className="email-input"
                        placeholder="Enter email subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                
                <div className="email-form-group">
                    <label htmlFor="email-content">Draft Email Report:</label>
                    <textarea
                        id="email-content"
                        className="email-textarea"
                        placeholder="Type your email report content here..."
                        rows="5"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>
                
                <button 
                    onClick={handleSendEmail}
                    disabled={EmailLoading}
                    className="email-button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    {EmailLoading ? 'Sending...' : 'Send Email Report'}
                </button>
                <div className="form-group">
                    <label className="form-label">Attach File:</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        accept=".pdf,.doc,.docx,.txt"
                    />
                    <button
                        type="button"
                        onClick={handleFileButtonClick}
                        className="btn btn-secondary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                        </svg>
                        {attachment ? attachment.name : 'Choose File'}
                    </button>
                    {attachment && (
                        <p className="form-help">Selected: {attachment.name} ({(attachment.size / 1024).toFixed(2)} KB)</p>
                    )}
                </div>
            </div>
        </div>
    )
}
