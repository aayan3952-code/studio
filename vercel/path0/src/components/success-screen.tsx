
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { sendConfirmationEmail } from '@/lib/actions';

type SuccessScreenProps = {
  onReset: () => void;
  trackingId: string;
  userEmail: string;
  userName: string;
};

export function SuccessScreen({ onReset, trackingId, userEmail, userName }: SuccessScreenProps) {
  const [isSending, setIsSending] = useState(false);
  const trackingUrl = `/track?id=${trackingId}`;
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingId);
    toast({
      title: 'Copied!',
      description: 'Tracking ID copied to clipboard.',
    });
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    const result = await sendConfirmationEmail(trackingId);
    setIsSending(false);

    if (result.success) {
      toast({
        title: 'Email Sent!',
        description: `A copy of the agreement has been sent to ${userEmail}.`,
      });
    } else {
      toast({
        title: 'Email Failed',
        description: result.error || 'Could not send the confirmation email.',
        variant: 'destructive',
      });
    }
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
          You can track the status of your submission using this ID.
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

        <div className="mt-6 border-t pt-6">
            <Button onClick={handleSendEmail} disabled={isSending} className="w-full max-w-sm mx-auto">
                {isSending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                    <><Send className="mr-2 h-4 w-4" /> Send Copy of Contract to My Mail</>
                )}
            </Button>
        </div>

      </CardContent>
    </Card>
  );
}
