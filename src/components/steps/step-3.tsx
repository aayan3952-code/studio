'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const paymentOptions = [
  'ZELLE TRANSFER',
  'PAYPAL',
  'Wire Transfer',
];

export default function Step3() {
  const { control } = useFormContext();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Terms</h3>
        <p className="text-sm text-muted-foreground">Payment is due prior to service activation</p>
      </div>

      <FormField
        control={control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="font-semibold">Select Payment Option:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {paymentOptions.map((option) => (
                  <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={option} />
                    </FormControl>
                    <FormLabel className="font-normal">{option}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      <div className="text-sm text-muted-foreground space-y-2">
        <p>Payments may be processed via third-party accounts to enable same-day service</p>
        <p>A digital receipt will be issued upon payment</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Refund Policy</h3>
        <div className="text-sm text-muted-foreground space-y-2">
            <p>The $470 dedicated lane setup fee is refundable after the Client completes their first delivery arranged by the Company</p>
            <p>Other service fees are non-refundable once service begins, as these are time-sensitive administrative tasks.</p>
            <p>Refunds will be issued via the original payment method within 5-7 business days, if applicable</p>
        </div>
      </div>
      
      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Client Responsibilities</h3>
        <p className="text-sm text-muted-foreground">The Client agrees to:</p>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>Provide accurate legal business and driver information</li>
            <li>Maintain active authority (MC/DOT) and valid insurance, unless Company is assisting with setup</li>
            <li>Communicate in a timely and professional manner</li>
            <li>Not engage in fraud, chargebacks, or misrepresentation</li>
        </ul>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">No Employer-Employee Relationship</h3>
        <p className="text-sm text-muted-foreground">This Agreement does not create an employment relationship. The Client is an independent carrier and assumes all responsibility for tax, insurance, regulatory compliance, and FMCSA obligations.</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Authorized Communication Only</h3>
        <p className="text-sm text-muted-foreground">If contacted by any unauthorized third party, the Client must verify with the Company before sending payments or documents.</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Limitation of Liability</h3>
        <p className="text-sm text-muted-foreground">The Company is not liable for:</p>
         <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>Any loss of income due to delays, market rates, or missed loads</li>
            <li>Legal or regulatory penalties due to false or missing information provided by the Client</li>
            <li>Broker cancellations or third-party payment processing delays</li>
        </ul>
      </div>
      
      <Separator />

       <div className="space-y-2">
          <h3 className="text-lg font-medium">Dispatch/Service Provider Representative</h3>
          <p className="text-sm">Trusted Freight LLC</p>
          <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}</p>
        </div>

    </div>
  );
}
