'use client';

type UserMedia = {
    id: string;
    mediaType: "IMG" | "VIDEO" | null;
    url: string;
}
import React from 'react';
import { getUserMedia } from '#/services/projects';
import { useApi } from './useApi';
import { EventBus } from '#/utils/event-bus';
import { USER_MEDIA_EVENT } from '#/constants/events';
/**
 * Hook that provides a client management interface for the user media table in the database.
 * This hook is used to manage user-uploaded media, such as images and icons.
 * It does not require a provider as it makes use of the `EventBus` class to listen and emit events related to user media.
 */
function useUserMedia({ shouldFetch = true }: { shouldFetch?: boolean } = {}) {
    const {
        data: userMedia,
        isFetching,
        error,
        page,
        totalPages,
        refetch,
        fetchMore,
        add,
        remove
    } = useApi({
        fetchFn: getUserMedia,
        shouldFetch
    });

    React.useEffect(() => {
        const listener = ({ userMedia }: { userMedia: UserMedia }) => {
            add(userMedia);
        };
        EventBus.on(USER_MEDIA_EVENT, listener);
        return () => EventBus.off(USER_MEDIA_EVENT, listener);
    }, [add]);

    return {
        userMedia,
        isFetching,
        error,
        page,
        totalPages,
        appendUserMedia: fetchMore,
        refetch,
        addUserMedia: add,
        removeUserMedia: remove
    };
}

export {
    type UserMedia,
    useUserMedia
}