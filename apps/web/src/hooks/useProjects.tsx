'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { getCommunityProjects } from '#/services/projects';
type CommunityProjectsData = Awaited<ReturnType<typeof getCommunityProjects>>[number];

type UserDesignsData = {
    id: string;
    name: string;
    canView: 'SELF' | 'ORG' | 'PUBLIC';
    isTemplate?: boolean;
    width: number;
    height: number;
    updatedAt: Date;
};
// update this map to add new states
type ProjectsDataMap = {
    community: CommunityProjectsData;
    userDesigns: UserDesignsData;
    favourites: WithIdAndName;
};

type WithIdAndName = { id: string; name: string };

type ProjectsSlice<T extends WithIdAndName = WithIdAndName> = {
    data: T[];
    page: number;
    hasMore: boolean;
    filteredData?: T[];
};

type ProjectsState = {
    [K in keyof ProjectsDataMap]: ProjectsSlice<ProjectsDataMap[K]>;
};




type ProjectsContextType = {
    state: ProjectsState;
    setSlice: <K extends keyof ProjectsDataMap>(update: {
        slice: K;
        data?: ProjectsDataMap[K][];
        page?: number;
        hasMore?: boolean;
        mode?: 'append' | 'replace';
    }) => void;
    filterByKeyword: <K extends keyof ProjectsDataMap>(slice: K, keyword: string) => void;
    filterByFn: <K extends keyof ProjectsDataMap>(slice: K, fn: (d: ProjectsDataMap[K]) => boolean) => void;
    clearFilter: (slice: keyof ProjectsDataMap) => void;
    updateItemInSlice: <K extends keyof ProjectsDataMap>(
        slice: K,
        id: string,
        update: Partial<ProjectsDataMap[K]>
    ) => void;
};

const defaultState: ProjectsState = {
    community: { data: [], page: 1, hasMore: true },
    userDesigns: { data: [], page: 1, hasMore: true },
    favourites: { data: [], page: 1, hasMore: true },
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

const ProjectsProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<ProjectsState>(defaultState);

    const setSlice: ProjectsContextType['setSlice'] = ({
        slice,
        data = [],
        page = 1,
        hasMore = true,
        mode = 'append',
    }) => {
        setState((prev) => {
            const prevSlice = prev[slice];
            const newData = mode === 'replace' ? data : [...prevSlice.data, ...data];

            return {
                ...prev,
                [slice]: {
                    ...prevSlice,
                    data: newData,
                    page,
                    hasMore,
                    filteredData: undefined,
                },
            };
        });
    };

    const filterByKeyword: ProjectsContextType['filterByKeyword'] = (slice, keyword) => {
        setState((prev) => {
            const original = prev[slice].data;
            const filtered = original.filter((item: any) =>
                item.name.toLowerCase().includes(keyword.toLowerCase())
            );

            return {
                ...prev,
                [slice]: {
                    ...prev[slice],
                    filteredData: filtered,
                },
            };
        });
    };

    const filterByFn: ProjectsContextType['filterByFn'] = (slice, filterFn) => {
        setState((prev) => {
            const original = prev[slice].data;
            const filtered = original.filter(filterFn);

            return {
                ...prev,
                [slice]: {
                    ...prev[slice],
                    filteredData: filtered,
                },
            };
        });
    };

    const clearFilter: ProjectsContextType['clearFilter'] = (slice) => {
        setState((prev) => ({
            ...prev,
            [slice]: {
                ...prev[slice],
                filteredData: undefined,
            },
        }));
    };
    const updateItemInSlice: ProjectsContextType['updateItemInSlice'] = (slice, id, update) => {
        setState((prev) => {
            const currentSlice = prev[slice];
            const updatedData = currentSlice.data.map((item) =>
                item.id === id ? { ...item, ...update } : item
            );

            const updatedFilteredData = currentSlice.filteredData?.map((item) =>
                item.id === id ? { ...item, ...update } : item
            );

            return {
                ...prev,
                [slice]: {
                    ...currentSlice,
                    data: updatedData,
                    filteredData: updatedFilteredData,
                },
            };
        });
    };

    const value = useMemo(
        () => ({
            state,
            setSlice,
            filterByKeyword,
            filterByFn,
            clearFilter,
            updateItemInSlice
        }),
        [state]
    );

    return (
        <ProjectsContext.Provider value={value}>
            {children}
        </ProjectsContext.Provider>
    );
};

const useProjects = () => {
    const ctx = useContext(ProjectsContext);
    if (!ctx) throw new Error('useProjects must be used within a ProjectsProvider');
    return ctx;
};
export {
    ProjectsProvider,
    useProjects
};
export type {
    CommunityProjectsData
};

