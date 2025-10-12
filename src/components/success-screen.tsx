
'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type SuccessScreenProps = {
  onReset: () => void;
  trackingId: string;
  userEmail: string;
  userName: string;
};

export function SuccessScreen({ onReset, trackingId, userEmail, userName }: SuccessScreenProps) {
  const trackingUrl = `/track?id=${trackingId}`;
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingId);
    toast({
      title: 'Copied!',
      description: 'Tracking ID copied to clipboard.',
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-in fade-in-50 duration-500">
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
        <div className="flex justify-center items-center gap-2">
            <p className="font-mono text-xl my-2 bg-muted rounded-md p-2 inline-block">{trackingId}</p>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>Copy</Button>
        </div>
        <p className="text-muted-foreground mt-4">
          A confirmation email with the agreement details and a PDF copy has been sent to <span className="font-medium text-foreground">{userEmail}</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button onClick={onReset}>
              Submit Another Agreement
            </Button>
            <Button asChild variant="secondary">
              <Link href={trackingUrl}>
                Track Your Submission <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
