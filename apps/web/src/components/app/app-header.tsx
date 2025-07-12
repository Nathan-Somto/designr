'use client';

import { LINKS } from '#/constants/links';
import OrganizationSwitcher from '#/features/auth/components/organization-switcher';
import { ActiveOrganization } from '@designr/auth/client';
import { Button } from '@designr/ui/components/button';
import Hint from '@designr/ui/components/hint';
import { SearchBar } from '@designr/ui/components/search-bar';
import { BellIcon, CreditCardIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { NotificationPopover } from './notifications-popover';
import { useProjects } from '#/hooks/useProjects';

// Map from route keyword to config
const searchMap = {
  [LINKS.DASHBOARD]: {
    placeholder: 'Search your designs',
    slice: 'userDesigns',
  },
  [LINKS.COMMUNITY]: {
    placeholder: 'Search through our community curated templates',
    slice: 'community',
  },
  [LINKS.FAVOURITES]: {
    placeholder: 'Search through your favourite templates',
    slice: 'favourites',
  },
} as const;

type Props = {
  organization: ActiveOrganization | null;
};

let debounceTimeout: ReturnType<typeof setTimeout>;

export default function AppHeader({ organization }: Props) {
  const pathname = usePathname();
  const { filterByKeyword } = useProjects();
  const router = useRouter();
  const match = pathname.match(/\/(dashboard|community|favourites)/);
  //console.log("the match: ", match)
  const matchedKey = match?.[0] as keyof typeof searchMap | undefined;
  const config = matchedKey ? searchMap[matchedKey] : null;
  //console.log("the config: ", config);
  const handleSearch = (value: string) => {
    if (!config) return;
    clearTimeout(debounceTimeout);
    console.log("config.slice", config.slice);
    debounceTimeout = setTimeout(() => {
      filterByKeyword(config.slice, value);
    }, 300);
  };

  return (
    <header className='pl-10 sticky flex h-20 z-[50] items-center gap-x-5 top-0 bg-white w-full inset-x-0'>
      {pathname !== LINKS.SETTINGS && config && (
        <SearchBar
          placeholder={config.placeholder}
          onChange={(e) => handleSearch(e.target.value)}
          className='flex-1 max-w-[500px] mx-auto'
          inputClassName='h-[42px]'
        />
      )}
      {(pathname === LINKS.SETTINGS || pathname === LINKS.SUBSCRIPTIONS) && (
        <h2 className='text-2xl font-semibold flex-1 my-auto self-center'>
          {pathname === LINKS.SETTINGS ? 'Settings' : 'Subscriptions'}
        </h2>
      )}
      <div className='gap-x-0.5 flex items-center'>
        <Hint label='Subscription' side='bottom'>
          <Button
            size='shrink'
            className='px-0.5 hidden h-fit sm:flex'
            variant='ghost'
            data-active={pathname === LINKS.SUBSCRIPTIONS}
            onClick={() => router.push(LINKS.SUBSCRIPTIONS)}
          >
            <CreditCardIcon />
            <span className='sr-only'>Subscription</span>
          </Button>
        </Hint>
        <NotificationPopover>
          <Button
            size='shrink'
            className='px-0.5 hidden h-fit sm:flex relative'
            variant='ghost'
          >
            <BellIcon />
            <span className='sr-only'>Notifications</span>
            <div className='absolute top-[10px] right-[11.5px] bg-primary size-1.5 rounded-full animate-pulse' />
          </Button>
        </NotificationPopover>
        <OrganizationSwitcher activeOrganization={organization} />
      </div>
    </header>
  );
}
