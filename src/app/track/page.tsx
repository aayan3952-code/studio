
'use client';

import { useState } from 'react';
import { getAgreement } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Truck, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

type AgreementData = {
  id: string;
  status: string;
  carrierFullName: string;
  dispatchCompany: string;
  submittedAt: string;
  [key: string]: any;
};

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [agreement, setAgreement] = useState<AgreementData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) {
      setError('Please enter a tracking ID.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAgreement(null);
    const result = await getAgreement(trackingId);
    if (result.success && result.data) {
      setAgreement(result.data as AgreementData);
    } else {
      setError(result.error || 'Failed to find agreement.');
    }
    setIsLoading(false);
  };
  
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'default';
      case 'in progress':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Truck className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-4xl font-headline font-bold text-foreground mt-4">Track Your Agreement</h1>
          <p className="text-muted-foreground mt-2 text-lg">Enter your tracking ID to see the current status.</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex items-center gap-4">
              <Input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID (e.g., aBcDeFgHiJkLmN123)"
                className="h-12 text-base"
              />
              <Button type="submit" size="lg" disabled={isLoading} className="h-12">
                {isLoading ? 'Searching...' : <Search className="h-5 w-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {agreement && (
          <Card className="mt-6 animate-in fade-in-50 duration-500">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="text-2xl">Agreement Details</CardTitle>
                    <CardDescription>Tracking ID: {agreement.id}</CardDescription>
                </div>
                <Badge variant={getStatusVariant(agreement.status) as any} className="text-sm px-3 py-1">
                    {agreement.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-muted-foreground">Carrier Name</p>
                        <p className="font-medium">{agreement.carrierFullName}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Dispatch Company</p>
                        <p className="font-medium">{agreement.dispatchCompany}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Submitted At</p>
                        <p className="font-medium">{new Date(agreement.submittedAt).toLocaleString()}</p>
                    </div>
                </div>
            </CardContent>
             <CardFooter className="flex-col items-start gap-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Clock className="h-4 w-4" />
                    <span>Status is updated in real-time.</span>
                </div>
                 <Button asChild variant="link" className="p-0 h-auto">
                    <Link href="/">Submit another agreement</Link>
                </Button>
            </CardFooter>
          </Card>>
        )}
      </div>
    </main>
  );
}
