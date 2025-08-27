'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type StepIndicatorProps = {
  steps: { id: number; name: string }[];
  currentStep: number;
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn('relative', {
              'flex-1': stepIdx !== steps.length - 1,
            })}
          >
            <>
              {stepIdx < currentStep ? (
                // Completed Step
                <div className="group flex w-full items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary group-hover:bg-primary/90">
                      <Check className="h-6 w-6 text-primary-foreground" />
                    </span>
                    <span className="ml-4 hidden text-sm font-medium text-foreground md:inline-block font-headline">{step.name}</span>
                  </span>
                </div>
              ) : stepIdx === currentStep ? (
                // Current Step
                <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary">
                    <span className="text-primary">{`0${step.id}`}</span>
                  </span>
                  <span className="ml-4 hidden text-sm font-medium text-primary md:inline-block font-headline">{step.name}</span>
                </div>
              ) : (
                // Upcoming Step
                <div className="group flex items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-border group-hover:border-muted-foreground">
                      <span className="text-muted-foreground group-hover:text-foreground">{`0${step.id}`}</span>
                    </span>
                    <span className="ml-4 hidden text-sm font-medium text-muted-foreground group-hover:text-foreground md:inline-block font-headline">{step.name}</span>
                  </span>
                </div>
              )}

              {stepIdx !== steps.length - 1 ? (
                <div className="absolute right-0 top-0 h-full w-5 md:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-border"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0.5 0V30L10.5 40L0.5 50V80"
                      stroke="currentcolor"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              ) : null}
            </>
          </li>
        ))}
      </ol>
    </nav>
  );
}
