import { z } from 'zod';

export const serviceAgreementSchema = z.object({
  // Step 1: Carrier Information
  dispatchCompany: z.string({
    required_error: 'Please select a dispatch company.',
  }).min(1, 'Please select a dispatch company.'),

  // Step 2: Carrier Information
  carrierFullName: z.string().min(2, 'Please enter a valid name.'),
  companyName: z.string().optional(),
  mcNumber: z.string().min(2, "Please enter a valid MC number."),
  dotNumber: z.string().regex(/^[0-9]{6,8}$/, 'Enter a valid 6-8 digit DOT number.'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number.'),
  
  // Services with Fees
  dedicatedLaneSetup: z.boolean().default(false).optional(),
  twicCardApplication: z.boolean().default(false).optional(),
  trailerRental: z.boolean().default(false).optional(),
  factoringSetup: z.boolean().default(false).optional(),
  insuranceAssistance: z.boolean().default(false).optional(),

  // Step 3: Payment
  paymentMethod: z.string({
    required_error: 'Please select a payment option.',
  }).min(1, 'Please select a payment option.'),

  // Step 4: Agreement Terms
  signature: z.string().min(3, 'Please enter a signature.'),
  printName: z.string().min(3, 'Please enter your full name.'),
  date: z.date({
    required_error: 'A date is required.',
  }),
  email: z.string().email('Please enter a valid email address.'),
  howYouGetPaid: z.enum(['factoring', 'ach'], {
    required_error: 'You need to select a payment method.',
  }),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.howYouGetPaid === 'ach') {
        if (!data.bankName) {
            ctx.addIssue({
                code: 'custom',
                path: ['bankName'],
                message: 'Bank name is required for ACH.',
            });
        }
        if (!data.accountNumber) {
            ctx.addIssue({
                code: 'custom',
                path: ['accountNumber'],
                message: 'Account number is required for ACH.',
            });
        }
        if (!data.routingNumber) {
            ctx.addIssue({
                code: 'custom',
                path: ['routingNumber'],
                message: 'Routing number is required for ACH.',
            });
        }
    }
});


export type FormValues = z.infer<typeof serviceAgreementSchema>;
