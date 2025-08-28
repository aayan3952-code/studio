'use client';

import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type SuccessScreenProps = {
  onReset: () => void;
  trackingId: string;
};

export function SuccessScreen({ onReset, trackingId }: SuccessScreenProps) {
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
          Your Tracking ID is:
        </p>
        <p className="font-mono text-xl my-2 bg-muted rounded-md p-2 inline-block">{trackingId}</p>
        <p className="text-muted-foreground mt-4">
          You can track the status of your agreement using this ID.
        </p>
        <Button onClick={onReset} className="mt-8">
          Create New Agreement
        </Button>
      </CardContent>
    </Card>
  );
}
