import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@repo/ui/components/dialog';
import { Trash, Undo2, Redo2, Copy, ClipboardPaste, Group, Ungroup, } from 'lucide-react';
import { SelectIcon } from '@radix-ui/react-select';

const keyboardShortcuts = [
  {
    command: 'Backspace / Delete',
    description: 'Delete the selected object',
    Icon: Trash
  },
  {
    command: 'Ctrl + Z',
    description: 'Undo the last action',
    Icon: Undo2
  },
  {
    command: 'Ctrl + Shift + Z',
    description: 'Redo the last action',
    Icon: Redo2
  },
  {
    command: 'Ctrl + C',
    description: 'Copy the selected object',
    Icon: Copy
  },
  {
    command: 'Ctrl + V',
    description: 'Paste the copied object',
    Icon: ClipboardPaste
  },
  {
    command: 'Ctrl + G',
    description: 'Group the selected objects',
    Icon: Group
  },
  {
    command: 'Ctrl + U',
    description: 'Ungroup the selected objects',
    Icon: Ungroup
  },
  {
    command: 'Ctrl + A',
    description: 'Select all objects',
    Icon: SelectIcon
  }
];
type props = {
  open: boolean,
  setOpen: (open: boolean) => void
}
function KeyboardShortcutsDialog({ open, setOpen }: props) {
  return (
    <Dialog open={open} onOpenChange={open => setOpen(open)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Quick  keyboard commands reference for  editing the canvas.</DialogDescription>
        </DialogHeader>
        <ul className="mt-4 space-y-3">
          {keyboardShortcuts.map((shortcut, index) => (
            <li key={index} className="flex items-center space-x-3">
              <shortcut.Icon className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-semibold">{shortcut.command}</p>
                <p className="text-gray-500 text-sm">{shortcut.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsDialog;
