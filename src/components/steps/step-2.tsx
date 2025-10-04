'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const services = [
  { id: 'dedicatedLaneSetup', label: 'Dedicated Lane Setup $479 Refundable after first successful load delivery' },
  { id: 'twicCardApplication', label: 'TWIC Card Application $445 Same-day processing' },
  { id: 'trailerRental', label: 'Trailer Rental (3 months) $500 Subject to availability' },
  { id: 'factoringSetup', label: 'Factoring Setup $420 Same-day registration' },
  { id: 'insuranceAssistance', label: 'Insurance Assistance $399 Fast-track insurance quote & setup' },
];

export default function Step2() {
  const { control } = useFormContext();

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <FormField
          control={control}
          name="carrierFullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carrier Full Name:</FormLabel>
              <FormControl>
                <Input placeholder="Enter Carrier Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name (if applicable):</FormLabel>
              <FormControl>
                <Input placeholder="Enter Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="mcNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MC Number:</FormLabel>
              <FormControl>
                <Input placeholder="Enter Carrier MC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="dotNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DOT Number:</FormLabel>
              <FormControl>
                <Input placeholder="Enter Carrier USDOT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number:</FormLabel>
              <FormControl>
                <Input placeholder="Enter Phone Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Purpose of Agreement</h3>
          <p className="text-sm text-muted-foreground">
            This Agreement outlines the terms and conditions under which the Company provides setup and logistics
            services to the Client, including but not limited to:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>Dedicated freight lanes</li>
            <li>Dispatch assistance</li>
            <li>Trailer rental</li>
            <li>TWIC card application support</li>
            <li>Commercial insurance setup</li>
            <li>Factoring registration</li>
          </ul>
           <p className="text-sm text-muted-foreground mt-2">
            Access to high-paying loads through partnered shippers including Amazon & government contracts
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select Services With Fees:</h3>
        <div className="space-y-2">
          {services.map((service) => (
            <FormField
              key={service.id}
              control={control}
              name={service.id as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{service.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
      
      <Separator />

       <div className="space-y-2">
          <h3 className="text-lg font-medium">Dispatch/Service Provider Representative</h3>
          <p className="text-sm">ECHO GLOBAL LOGISTICS INC </p>
          <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString('en-CA')}</p>
        </div>

    </div>
  );
}