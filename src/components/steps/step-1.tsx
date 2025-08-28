'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const dispatchCompanies = [
  'Beyond Trucking LLC',
  'Truckie Dispatch Services',
  'Prime Lanes Dispatch Services',
  'Sqab Dispatch Services',
  'MZ Dispatch Services',
  'North Star Shipping LLC',
];

export default function Step1() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="dispatchCompany"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dispatch Company Name:</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Dispatch Company" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dispatchCompanies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
