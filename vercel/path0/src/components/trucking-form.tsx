
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';

import { serviceAgreementSchema, type FormValues } from '@/lib/schemas';
import { saveAgreement } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Step1 from '@/components/steps/step-1';
import Step2 from '@/components/steps/step-2';
import Step3 from '@/components/steps/step-3';
import Step4 from '@/components/steps/step-4';
import { SuccessScreen } from '@/components/success-screen';

const steps = [
  { id: 1, name: 'Step 1', fields: ['dispatchCompany'] },
  { id: 2, name: 'Step 2', fields: ['carrierFullName', 'companyName', 'mcNumber', 'dotNumber', 'phoneNumber', 'dedicatedLaneSetup', 'twicCardApplication', 'trailerRental', 'factoringSetup', 'insuranceAssistance'] },
  { id: 3, name: 'Step 3', fields: ['paymentMethod'] },
  { id: 4, name: 'Final Submission', fields: ['signature', 'printName', 'date', 'email', 'howYouGetPaid', 'bankName', 'accountNumber', 'routingNumber'] },
];

type TruckingFormProps = {
  onStepChange: (step: number) => void;
};

const initialValues: FormValues = {
  dispatchCompany: '',
  carrierFullName: '',
  companyName: '',
  mcNumber: '',
  dotNumber: '',
  phoneNumber: '',
  dedicatedLaneSetup: false,
  twicCardApplication: false,
  trailerRental: false,
  factoringSetup: false,
  insuranceAssistance: false,
  paymentMethod: '',
  signature: '',
  printName: '',
  date: new Date(),
  email: '',
  howYouGetPaid: 'factoring',
  bankName: '',
  accountNumber: '',
  routingNumber: '',
};

export function TruckingForm({ onStepChange }: TruckingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionData, setSubmissionData] = useState<{trackingId: string, userEmail: string, userName: string} | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const methods = useForm<FormValues>({
    resolver: zodResolver(serviceAgreementSchema),
    mode: 'onChange',
    defaultValues: initialValues,
  });

  const { handleSubmit, trigger, reset, watch } = methods;
  const selectedCompany = watch('dispatchCompany');
  const currentStepData = useMemo(() => steps[currentStep], [currentStep]);
  
  useEffect(() => {
    onStepChange(currentStep);
  }, [currentStep, onStepChange]);

  const processForm = async (data: FormValues) => {
    setIsPending(true);
    const result = await saveAgreement(data);
    setIsPending(false);

    if (result.success && result.docId) {
      setSubmissionData({
        trackingId: result.docId,
        userEmail: data.email,
        userName: data.carrierFullName,
      });
    } else {
      let errorMessage = 'An unknown error occurred.';
      if (result.error) {
        errorMessage = result.error;
      }
      
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as (keyof FormValues)[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleSubmit(processForm)();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  
  const handleReset = () => {
    reset(initialValues);
    setCurrentStep(0);
    setSubmissionData(null);
  };

  if (submissionData) {
    return <SuccessScreen 
      onReset={handleReset} 
      trackingId={submissionData.trackingId}
      userEmail={submissionData.userEmail}
      userName={submissionData.userName}
    />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="pt-4 font-headline text-2xl md:text-3xl">{currentStepData.name}</CardTitle>
        <CardDescription>
          {currentStep === 0 
            ? "The Client should only respond to verified contacts from the Company or the following trusted dispatch partners:"
            : `Please fill out the details for step ${currentStep + 1}.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && <Step1 />}
                  {currentStep === 1 && <Step2 />}
                  {currentStep === 2 && <Step3 />}
                  {currentStep === 3 && <Step4 />}
                </motion.div>
            </AnimatePresence>
          </form>
        </FormProvider>
        {currentStep === 0 && selectedCompany && (
          <div className="mt-4 text-sm space-y-4 text-muted-foreground">
            <p>(Hereinafter referred to as the {selectedCompany})</p>
            <div>
              <p className="font-bold text-foreground">Dispatch/Service Provider Representative</p>
              <p>{selectedCompany}</p>
              <p>Date: {new Date().toISOString().slice(0, 10)}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isPending} className="w-full">
            Previous
        </Button>
        <Button onClick={handleNext} disabled={isPending} className="w-full">
          {isPending ? 'Submitting...' : currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
}
