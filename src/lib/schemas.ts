import { z } from 'zod';

export const serviceAgreementSchema = z.object({
  // Step 1: Carrier Information
  dispatchCompany: z.string({
    required_error: 'Please select a dispatch company.',
  }),
  companyName: z.string().min(2, 'Company name must be at least 2 characters.').optional(),
  dotNumber: z.string().regex(/^[0-9]{6,8}$/, 'Enter a valid 6-8 digit DOT number.').optional(),
  carrierAddress: z.string().min(5, 'Please enter a valid address.').optional(),

  // Step 2: Shipper Information
  shipperName: z.string().min(2, 'Shipper name must be at least 2 characters.'),
  contactPerson: z.string().min(2, 'Contact person must be at least 2 characters.'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number.'),

  // Step 3: Service Details
  serviceType: z.enum(['FTL', 'LTL', 'Drayage', 'Intermodal'], {
    required_error: 'You need to select a service type.',
  }),
  cargoDescription: z.string().min(10, 'Please provide a detailed cargo description.'),
  specialInstructions: z.string().optional(),

  // Step 4: Agreement Terms
  authorizedPersonName: z.string().min(3, 'Please enter the full name.'),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

export type FormValues = z.infer<typeof serviceAgreementSchema>;
