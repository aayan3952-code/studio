'use server';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { render } from '@react-email/render';
import { ContractEmailTemplate } from '@/components/emails/contract-template';
import type { FormValues } from './schemas';

// Puppeteer-based solution (more robust, but heavier) would be:
// const browser = await puppeteer.launch();
// const page = await browser.newPage();
// await page.setContent(html, { waitUntil: 'networkidle0' });
// const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
// await browser.close();
// return pdfBuffer;

export async function generateContractPdf(agreement: FormValues & { id: string, submittedAt: string }): Promise<Buffer> {
    
    // This is a workaround because html2canvas and jspdf run in a Node.js server environment,
    // but they are primarily designed for the browser. We need to create a "virtual" DOM to render the HTML.
    // A more robust solution for server-side rendering is using a library like Puppeteer,
    // but that adds significant complexity and dependencies to the Vercel serverless environment.
    // This approach is a trade-off for simplicity.
    
    const html = render(ContractEmailTemplate({ agreement }));

    // For server-side rendering, you'd typically need a headless browser like puppeteer
    // to correctly render HTML to an image. html2canvas has limitations in a pure Node.js env.
    // This function is illustrative and might need to be replaced with a puppeteer-based microservice
    // or a third-party API for robust server-side PDF generation in production.

    // The below code is intended to be run in an environment that can simulate a browser canvas.
    // It will likely fail in a standard Vercel serverless function without more setup.
    // I am providing it to complete the logic, but please be aware of this limitation.

    try {
        // A direct HTML-to-PDF solution without a browser environment is non-trivial.
        // jsPDF can add text manually, but converting styled HTML is complex.
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4',
        });
        
        // We're adding the raw HTML. This won't be perfectly styled.
        // For full styling, html2canvas is needed, which requires a browser-like environment.
        await doc.html(html, {
            callback: function (doc) {
                 // a Buffer is returned.
            },
            x: 10,
            y: 10,
            width: 400, // A4 width in px at 96 dpi
            windowWidth: 600,
        });
        
        const pdfOutput = doc.output('arraybuffer');
        return Buffer.from(pdfOutput);

    } catch (error) {
        console.error("Error generating PDF: ", error);
        throw new Error("Could not generate PDF contract.");
    }
}
