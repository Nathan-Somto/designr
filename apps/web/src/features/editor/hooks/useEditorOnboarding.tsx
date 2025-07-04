import { useState, useEffect, useMemo, useCallback, forwardRef, useRef } from 'react';
import Joyride, { BeaconRenderProps, CallBackProps, EVENTS, Status, STATUS, TooltipRenderProps } from 'react-joyride';
import { editorOnboardingSteps } from '../data';
import { Button } from '@designr/ui/components/button';
import { authClient } from '@designr/auth/client';
import { onboardUser } from '#/services/users';
type Props = {
    releaseLoading?: () => void;
}
export const useEditorOnboarding = ({ releaseLoading }: Props) => {
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const { data, refetch } = authClient.useSession();
    const steps = useMemo(() => editorOnboardingSteps, []);
    const startedTour = useRef(false);
    const [hasOnboarded, setHasOnboarded] = useState(false);

    useEffect(() => {
        // check if pending has ended and the data is ready
        if (!data?.user) return;
        if (startedTour.current || hasOnboarded) return;
        const parsed = data.user;
        //console.log("the parsed user:", parsed);
        if (!parsed.hasOnboarded) {
            setRun(true);
        }
        releaseLoading?.();
        startedTour.current = true;
    }, [
        data?.user,
        hasOnboarded
    ]);
    useEffect(() => {
        if (!startedTour.current) return;
        if (hasOnboarded) {
            refetch();
        }
    }, [hasOnboarded])

    const handleJoyrideCallback = useCallback(async (data: CallBackProps) => {
        const { status, index, type } = data;

        if (type === EVENTS.STEP_AFTER) {
            setStepIndex(index + 1);
        }
        // End of the tour
        const endStates: Status[] = [STATUS.FINISHED, STATUS.SKIPPED];
        const finished = endStates.includes(status);
        if (finished) {
            await onboardUser();
            setHasOnboarded(true)
            setRun(false);
        }
    }, []);


    const BeaconComponent = forwardRef<HTMLButtonElement, BeaconRenderProps>((props, ref) => {
        return <span ref={ref} className={`  
    animate-pulse relative bg-primary rounded-full inline-block size-4
    `} >
            <div className="absolute -inset-1 rounded-full z-[-1] animate-pulse-glow bg-[#d5caff] opacity-40 group-hover:opacity-60 transition-opacity" />
        </span>;
    });
    const CustomTooltip = (props: TooltipRenderProps) => {
        const {
            backProps,
            index,
            isLastStep,
            primaryProps,
            size,
            skipProps,
            step: {
                content,
                title
            },
            tooltipProps,

        } = props;
        const progress = ((index + 1) / size) * 100;

        return (
            <div
                {...tooltipProps}
                className="rounded-lg bg-background overflow-hidden shadow-lg pt-4 max-w-md border border-gray-200"
            >
                {title && <h3 className="text-2xl font-semibold mb-3 px-4">{title}</h3>}
                <p className="text-sm text-muted-foreground mb-6 px-4">{content}</p>
                <div className='flex items-center justify-between px-4'>
                    {skipProps && (
                        <Button
                            {...skipProps}
                            variant={'ghost'}
                            className="text-sm hover:bg-transparent"
                            size="shrink"
                        >
                            Skip
                        </Button>
                    )}

                    <div className="flex items-center gap-x-3 px-4">
                        {index > 0 && (
                            <Button
                                {...backProps}
                                variant={'secondary'}
                                className="text-sm"
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            {...primaryProps}
                            className="text-sm px-8"
                        >
                            {isLastStep ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-background rounded-none overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        );
    }
    const JoyrideComponent = () => (
        <Joyride
            steps={steps}
            run={run}
            stepIndex={stepIndex}
            continuous
            showSkipButton
            callback={handleJoyrideCallback}
            tooltipComponent={CustomTooltip}
            beaconComponent={BeaconComponent}
            styles={{
                options: {
                    arrowColor: 'hsl(var(--background))',
                    backgroundColor: 'hsl(var(--background))',
                    overlayColor: 'rgba(0, 0, 0, 0.5)',
                    primaryColor: 'hsl(var(--primary))',
                    textColor: 'hsl(var(--foreground))',
                    zIndex: 60,
                },
                tooltipContainer: {
                    textAlign: 'left',
                },
                buttonClose: {
                    display: 'none',
                },
            }}
            disableCloseOnEsc
            disableOverlayClose
        />
    );

    return {
        JoyrideComponent,
        runTour: () => setRun(true),
    };
};
