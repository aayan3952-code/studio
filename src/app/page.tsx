import { TruckingForm } from '@/components/trucking-form';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <TruckingForm />
      </div>
    </main>
  );
}
