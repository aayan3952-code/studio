import { TruckingForm } from '@/components/trucking-form';
import { Progress } from '@/components/ui/progress';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-headline font-bold text-foreground">TRUCKING SERVICE AGREEMENT</h1>
          <p className="text-muted-foreground mt-2">(Dedicated Lanes, Dispatch, Trailer Rental, and Setup Services)</p>
        </div>
        <Progress value={25} className="w-full h-2" />
        <div className="text-center text-sm text-muted-foreground">
          <p>This Agreement is made and entered into on {new Date().toLocaleDateString('en-CA')}, by and between: Trusted Freight LLC</p>
          <p>Email: winston@trustedfreightsllc.com</p>
        </div>
        <TruckingForm />
      </div>
    </main>
  );
}
