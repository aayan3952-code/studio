'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

export default function Step3() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="serviceType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Service Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="FTL" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    FTL (Full Truckload)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="LTL" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    LTL (Less-than-Truckload)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Drayage" />
                  </FormControl>
                  <FormLabel className="font-normal">Drayage</FormLabel>
                </FormItem>
                 <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Intermodal" />
                  </FormControl>
                  <FormLabel className="font-normal">Intermodal</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={control}
        name="cargoDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cargo Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the cargo, including weight, dimensions, and any hazardous materials."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={control}
        name="specialInstructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Instructions</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Temperature control required, fragile items, delivery appointment needed."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide any special handling or delivery instructions.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
