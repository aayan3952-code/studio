
'use server';
/**
 * @fileOverview A flow for generating admin and user email notifications.
 *
 * - generateEmails - A function that creates HTML email content for admins and users.
 */

import { ai } from '@/ai/genkit';
import type { GenerateEmailsInput, GenerateEmailsOutput } from '@/lib/schemas';
import { GenerateEmailsInputSchema, GenerateEmailsOutputSchema } from '@/lib/schemas';

// Exported wrapper function to call the Genkit flow
export async function generateEmails(input: GenerateEmailsInput): Promise<GenerateEmailsOutput> {
  return generateEmailFlow(input);
}

// Create the main Genkit prompt
const emailPrompt = ai.definePrompt({
  name: 'generateEmailPrompt',
  input: { schema: GenerateEmailsInputSchema },
  output: { schema: GenerateEmailsOutputSchema },
  prompt: `
    You are an expert email copywriter for a trucking logistics company. Your task is to generate two separate, professional HTML emails based on a new service agreement submission.

    **Admin Email Requirements:**
    - To: t4tech2011@gmail.com
    - Subject: New Service Agreement Submission: {{{formData.carrierFullName}}} - {{{trackingId}}}
    - Body: Create a well-formatted HTML email that clearly displays all the information from the form submission. Use headings and lists to make it easy to read. Include the tracking ID prominently.

    **User Email Requirements:**
    - To: {{{formData.email}}}
    - Subject: Your Service Agreement has been Submitted! Tracking ID: {{{trackingId}}}
    - Body: Create a friendly, professional HTML email confirming that the user's submission has been received. Thank them for their submission. Prominently display their tracking ID and provide a link to track their submission status at '/track?id={{{trackingId}}}'. Include a summary of the key information they submitted for their records. Do not include the internal fields like bank details in the user's confirmation email.

    **Form Data:**
    - Tracking ID: {{{trackingId}}}
    - Dispatch Company: {{{formData.dispatchCompany}}}
    - Carrier Full Name: {{{formData.carrierFullName}}}
    - Company Name: {{{formData.companyName}}}
    - MC Number: {{{formData.mcNumber}}}
    - DOT Number: {{{formData.dotNumber}}}
    - Phone Number: {{{formData.phoneNumber}}}
    - Email: {{{formData.email}}}
    - Selected Services:
      - Dedicated Lane Setup: {{{formData.dedicatedLaneSetup}}}
      - TWIC Card Application: {{{formData.twicCardApplication}}}
      - Trailer Rental: {{{formData.trailerRental}}}
      - Factoring Setup: {{{formData.factoringSetup}}}
      - Insurance Assistance: {{{formData.insuranceAssistance}}}
    - Payment Method: {{{formData.paymentMethod}}}
    - Payment Preference: {{{formData.howYouGetPaid}}}
    - Signature: {{{formData.signature}}}
    - Print Name: {{{formData.printName}}}
    - Date Submitted: {{{formData.date}}}

    **Important:**
    - Generate complete, valid HTML for both emails.
    - Use inline CSS for styling to ensure maximum compatibility with email clients.
    - Ensure the tone is professional and reassuring.
  `,
});

// Define the Genkit flow
const generateEmailFlow = ai.defineFlow(
  {
    name: 'generateEmailFlow',
    inputSchema: GenerateEmailsInputSchema,
    outputSchema: GenerateEmailsOutputSchema,
  },
  async (input) => {
    const { output } = await emailPrompt(input);
    return output!;
  }
);
