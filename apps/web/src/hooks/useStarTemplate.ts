'use client'
import { useProjects } from '#/hooks/useProjects';
import { toggleTemplateStar } from '#/services/projects';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export function useStarTemplate() {
    const { updateItemInSlice } = useProjects();
    const [isPending, setIsPending] = useState(false);
    const prevValue = useRef<boolean | null>(null)
    const starTemplate = async (id: string, isStarred: boolean, slice: 'favourites' | 'community') => {
        prevValue.current = !isStarred;
        updateItemInSlice(slice, id, {
            isStarred
        });
        setIsPending(true);
        try {
            await toggleTemplateStar({
                projectId: id,
                shouldStar: isStarred
            });
            toast.success(`Template ${!prevValue ? 'starred' : 'unstarred'}`);
        } catch (error) {
            if (prevValue.current !== null) {
                updateItemInSlice(slice, id, {
                    isStarred: prevValue.current
                });
            }
            prevValue.current = null;
            toast.error('Failed to update template star status');
        }
        finally {
            setIsPending(false);
        }
    };

    return {
        starTemplate,
        isPending
    };
}
