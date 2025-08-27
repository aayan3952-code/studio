import { z } from 'zod';

export const serviceAgreementSchema = z.object({
  // Step 1: Carrier Information
  dispatchCompany: z.string({
    required_error: 'Please select a dispatch company.',
  }),

  // Step 2: Carrier Information
  carrierFullName: z.string().min(2, 'Please enter a valid name.'),
  companyName: z.string().optional(),
  mcNumber: z.string().min(2, "Please enter a valid MC number."),
  dotNumber: z.string().regex(/^[0-9]{6,8}$/, 'Enter a valid 6-8 digit DOT number.'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number.'),
  
  // Services with Fees
  dedicatedLaneSetup: z.boolean().optional(),
  twicCardApplication: z.boolean().optional(),
  trailerRental: z.boolean().optional(),
  factoringSetup: z.boolean().optional(),
  insuranceAssistance: z.boolean().optional(),

  // Step 3: Payment
  paymentMethod: z.string({
    required_error: 'Please select a payment option.',
  }),

  // Step 4: Agreement Terms
  authorizedPersonName: z.string().min(3, 'Please enter the full name.'),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

export type FormValues = z.infer<typeof serviceAgreementSchema>;
