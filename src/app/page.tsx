
'use client';

import { useState } from 'react';
import { TruckingForm } from '@/components/trucking-form';
import { Progress } from '@/components/ui/progress';

export default function Home() {
  const [progress, setProgress] = useState(25);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-headline font-bold text-foreground">TRUCKING SERVICE AGREEMENT</h1>
          <p className="text-muted-foreground mt-2">(Dedicated Lanes, Dispatch, Trailer Rental, and Setup Services)</p>
        </div>
        <Progress value={progress} className="w-full h-2" />
        <div className="text-center text-sm text-muted-foreground">
          <p>This Agreement is made and entered into on {new Date().toLocaleDateString('en-CA')}, by and between: Dedicated Global Carrier LLC</p>
          <p>Email: winston@dedicatedglobalcarrierllc.com</p>
        </div>
        <TruckingForm onStepChange={(step) => setProgress((step + 1) * 25)} />
      </div>
    </main>
  );
}
