'use client';

import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type SuccessScreenProps = {
  onReset: () => void;
};

export function SuccessScreen({ onReset }: SuccessScreenProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="items-center text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <CardTitle className="text-3xl font-headline mt-4">Submission Successful!</CardTitle>
        <CardDescription className="mt-2 text-lg">
          Your service agreement has been submitted.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">
          Thank you for your business. We will review the agreement and contact you shortly.
        </p>
        <Button onClick={onReset} className="mt-8">
          Create New Agreement
        </Button>
      </CardContent>
    </Card>
  );
}
