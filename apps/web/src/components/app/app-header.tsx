'use client';
import { LINKS } from '#/constants/links';
import OrganizationSwitcher from '#/features/auth/components/organization-switcher';
import { ActiveOrganization } from '@designr/auth/client';
import { Button } from '@designr/ui/components/button';
import Hint from '@designr/ui/components/hint';
import { SearchBar } from '@designr/ui/components/search-bar'
import { BellIcon, CreditCardIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react'
import { NotificationPopover } from './notifications-popover';
type Props = {
  placeholder?: string
  onSearch?: (term: string) => void;
  organization: ActiveOrganization | null
}

export default function AppHeader({
  onSearch,
  placeholder,
  organization
}: Props) {
  const pathname = usePathname();
  return (
    <header className='pl-10 sticky flex h-20 z-[50] m items-center gap-x-5 top-0 bg-white w-full inset-x-0'>
      {pathname !== LINKS.SETTINGS && (
        <SearchBar
          placeholder={placeholder ?? 'Search your Designs'}
          onChange={(e) => {
            onSearch?.(e.target.value);
          }}
          className='flex-1 max-w-[500px] mx-auto'
          inputClassName='h-[42px]'
        />
      )}
      {
        pathname === LINKS.SETTINGS && (
          <h2 className='text-2xl font-semibold flex-1 my-auto self-center'>
            Settings
          </h2>
        )
      }
      <div className='gap-x-0.5 flex items-center'>
        <Hint
          label='Billing'
          side='bottom'
        >
          <Button size="shrink" className='px-0.5 hidden h-fit sm:flex' variant={'ghost'}>
            <CreditCardIcon />
            <span className='sr-only'>
              Billing
            </span>
          </Button>
        </Hint>
        <NotificationPopover>
          <Button
            size="shrink"
            className='px-0.5 hidden h-fit sm:flex relative'
            variant={'ghost'}>

            <BellIcon />
            <span className='sr-only'>
              Notifications
            </span>
            <div className='absolute top-[10px] right-[11.5px] bg-primary size-1.5 rounded-full animate-pulse' />
          </Button>
        </NotificationPopover>
        <OrganizationSwitcher
          activeOrganization={organization}
        />
      </div>
    </header>
  )
}
