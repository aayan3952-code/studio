'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function Step1() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Acme Trucking Co." {...field} />
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
            <FormLabel>DOT Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter your 6-8 digit DOT number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="carrierAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Carrier Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St, Anytown, USA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
