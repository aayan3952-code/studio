
import React from 'react';
import { type FormValues } from '@/lib/schemas';

interface ContractEmailProps {
  agreement: FormValues & { id: string; submittedAt: string };
}

const containerStyle: React.CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  lineHeight: '1.6',
  color: '#333',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  border: '1px solid #ddd',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  borderBottom: '1px solid #ddd',
  paddingBottom: '20px',
  marginBottom: '20px',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#0A2540',
  borderBottom: '2px solid #F0F8FF',
  paddingBottom: '5px',
  marginBottom: '15px',
};

const detailItemStyle: React.CSSProperties = {
  marginBottom: '10px',
};

const detailLabelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#555',
};

const footerStyle: React.CSSProperties = {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #ddd',
    textAlign: 'center',
    fontSize: '12px',
    color: '#888',
};

export const ContractEmailTemplate: React.FC<ContractEmailProps> = ({ agreement }) => {
    const services = [
        { label: 'Dedicated Lane Setup', value: agreement.dedicatedLaneSetup },
        { label: 'TWIC Card Application', value: agreement.twicCardApplication },
        { label: 'Trailer Rental', value: agreement.trailerRental },
        { label: 'Factoring Setup', value: agreement.factoringSetup },
        { label: 'Insurance Assistance', value: agreement.insuranceAssistance },
    ].filter(service => service.value);

    // Ensure all date values are strings before rendering
    const formattedSubmissionDate = new Date(agreement.submittedAt).toLocaleString();
    const formattedAgreementDate = new Date(agreement.date).toLocaleDateString();

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1>Trucking Service Agreement</h1>
                <p>Confirmation & Record</p>
            </div>

            <div style={sectionStyle}>
                <p>Thank you for your submission. This email confirms the details of the service agreement entered into on {formattedAgreementDate}.</p>
                <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Tracking ID: </span> {agreement.id}
                </div>
                 <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Submission Date: </span> {formattedSubmissionDate}
                </div>
                 <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Status: </span> {agreement.status}
                </div>
            </div>

            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Carrier Information</h2>
                <div style={detailItemStyle}><span style={detailLabelStyle}>Carrier Full Name:</span> {agreement.carrierFullName}</div>
                {agreement.companyName && <div style={detailItemStyle}><span style={detailLabelStyle}>Company Name:</span> {agreement.companyName}</div>}
                <div style={detailItemStyle}><span style={detailLabelStyle}>MC Number:</span> {agreement.mcNumber}</div>
                <div style={detailItemStyle}><span style={detailLabelStyle}>DOT Number:</span> {agreement.dotNumber}</div>
                <div style={detailItemStyle}><span style={detailLabelStyle}>Email:</span> {agreement.email}</div>
                <div style={detailItemStyle}><span style={detailLabelStyle}>Phone Number:</span> {agreement.phoneNumber}</div>
            </div>

            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Service & Payment Details</h2>
                <div style={detailItemStyle}><span style={detailLabelStyle}>Dispatch Company:</span> {agreement.dispatchCompany}</div>
                <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Selected Services:</span>
                    {services.length > 0 ? (
                        <ul>
                            {services.map(s => <li key={s.label}>{s.label.split(' $')[0]}</li>)}
                        </ul>
                    ) : (
                        <span> None</span>
                    )}
                </div>
                <div style={detailItemStyle}><span style={detailLabelStyle}>Payment Method for Services:</span> {agreement.paymentMethod}</div>
            </div>

            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Payout Method</h2>
                <div style={detailItemStyle}><span style={detailLabelStyle}>How Carrier Gets Paid:</span> {agreement.howYouGetPaid === 'ach' ? 'ACH Direct Deposit' : 'Factoring'}</div>
                {agreement.howYouGetPaid === 'ach' && (
                    <>
                        <div style={detailItemStyle}><span style={detailLabelStyle}>Bank Name:</span> {agreement.bankName}</div>
                        <div style={detailItemStyle}><span style={detailLabelStyle}>Account Number:</span> {agreement.accountNumber}</div>
                        <div style={detailItemStyle}><span style={detailLabelStyle}>Routing Number:</span> {agreement.routingNumber}</div>
                    </>
                )}
            </div>

            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Signature</h2>
                <div style={detailItemStyle}><span style={detailLabelStyle}>Signed By (Printed Name):</span> {agreement.printName}</div>
                <div style={detailItemStyle}><span style={detailLabelStyle}>Date Signed:</span> {formattedAgreementDate}</div>
                <div style={detailItemStyle}><span style={detailLabelStyle}>Signature:</span> {agreement.signature}</div>
            </div>

            <div style={footerStyle}>
                <p>Dedicated Global Carrier LLC</p>
                <p>Email: winston@dedicatedglobalcarrierllc.com</p>
                <p>This is an automated message. Please do not reply directly to this email.</p>
            </div>
        </div>
    );
};
