import { Button } from '@designr/ui/components/button';
import Hint from '@designr/ui/components/hint';
import { SearchBar } from '@designr/ui/components/search-bar'
import { CreditCardIcon, InfoIcon } from 'lucide-react';
import React from 'react'
const AccountSwitcher = () => <div className="text-xs border-dashed border-destructive border max-w-[200px] mb-2 py-2 text-muted-foreground">Account Switcher</div>;
export default function AppHeader() {
  return (
    <header className='pl-10 sticky flex h-20 z-[50] m items-center gap-x-5 top-0 bg-white w-full inset-x-0'>
      <SearchBar
        placeholder='Search your Designs'
        className='flex-1 max-w-[500px] mx-auto'
        inputClassName='h-[42px]'
      />
      <div className='gap-x-0.5 flex items-center'>
        <Hint
          label='Billing'
          side='bottom'
        >
          <Button size="shrink" className='px-0.5 hidden sm:flex' variant={'ghost'}>
            <CreditCardIcon />
            <span className='sr-only'>
              Billing
            </span>
          </Button>
        </Hint>
        <Hint
          label='Privacy Policy'
          side='bottom'
        >
          <Button size="shrink" className='px-0.5 hidden sm:flex' variant={'ghost'}>
            <InfoIcon />
            <span className='sr-only'>
              Privacy Policy
            </span>
          </Button>
        </Hint>
        <AccountSwitcher />
      </div>
    </header>
  )
}
