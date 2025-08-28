'use client';

import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function Step4() {
  const { control, watch } = useFormContext();

  const paymentMethod = watch('howYouGetPaid');

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Term and Termination</h3>
        <p className="text-sm text-muted-foreground">
          This agreement becomes effective upon payment and remains active until the completion of the contracted services. Either party may terminate in writing at any time. Refund terms apply as per Section 4.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Entire Agreement</h3>
        <p className="text-sm text-muted-foreground">
          This Agreement contains the entire understanding between both parties and supersedes all prior agreements, written or oral.
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          control={control}
          name="signature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signature:</FormLabel>
              <FormControl>
                <Input placeholder="Enter Signature" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="printName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Print Name:</FormLabel>
              <FormControl>
                <Input placeholder="Enter Print Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date:</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'MM/dd/yyyy')
                      ) : (
                        <span>mm/dd/yyyy</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email:</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name="howYouGetPaid"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How you get paid.</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="factoring" />
                    </FormControl>
                    <FormLabel className="font-normal">Factoring</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ach" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      ACH DIRECT DEPOSIT METHOD
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {paymentMethod === 'ach' && (
          <div className="space-y-4 pl-6">
            <FormField
              control={control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Bank Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number:</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Account Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number:</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Routing Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <Image src="https://picsum.photos/50/50" alt="DOT Logo" width={50} height={50} data-ai-hint="logo" />
            <div>
              <p className="font-bold">U.S. Department of Transportation</p>
              <p className="text-sm">Federal Motor Carrier Safety Administration</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-sm">1200 New Jersey Ave., S.E.</p>
             <p className="text-sm">Washington, DC 20590</p>
          </div>
        </div>
        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
            <div>
                <p className="text-xs text-muted-foreground">CERTIFICATE</p>
                <p className="font-mono">MC-966811</p>
            </div>
             <div>
                <p className="text-xs text-muted-foreground">SERVICE DATE</p>
                <p>May 21, 2022</p>
            </div>
        </div>
         <div className="space-y-1">
            <p className="text-sm">U.S. DOT No. 2881025</p>
            <p className="text-sm">Dedicated Global Carrier LLC</p>
            <p className="text-sm">Address: 801 WEST BAY DRIVE, STE 106</p>
            <p className="text-sm">LARGO, FL 33770</p>
        </div>

        <div className="text-xs text-muted-foreground space-y-2">
            <p>This License is evidence of the applicant's authority to engage in operations, in interstate or foreign as a broker, arranging for transportation of freight (except household goods) by Motor Vehicle.</p>
            <p>This authority will be effective as long as the broker maintains insurance coverage for the protection of the public (49 CFR 387) and the designation of agents upon whom process may be served (49 CFR 366). The applicant shall also render reasonably continuous and adequate service to the public. Failure to maintain compliance will constitute sufficient grounds for revocation of this authority.</p>
        </div>
        
        <div className="pt-8">
            <p className="font-serif italic border-b border-foreground pb-1 w-48">Jeffry L. Secrist</p>
            <p className="text-xs">Jeffrey L. Secrist, Chief</p>
            <p className="text-xs">Information Technology Operations Division</p>
        </div>

        <div>
            <h4 className="font-bold text-sm">NOTE:</h4>
            <p className="text-xs text-muted-foreground">Willful and persistent noncompliance with applicable safety fitness regulations as evidenced by a DOT safety fitness rating of Unsatisfactory or by other indicators, could result in a proceeding requiring the holder of this certificate or permit to show cause why this authority should not be suspended or revoked.</p>
        </div>

        <div>
          <h4 className="font-bold text-sm">Dispatch/Service Provider Representative</h4>
          <p className="text-sm">Dedicated Global Carrier LLC</p>
          <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString('en-CA')}</p>
        </div>
      </div>

    </div>
  );
}
