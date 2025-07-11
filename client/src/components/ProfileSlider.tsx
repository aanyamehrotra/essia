'use client';

import { Sheet, SheetContent } from './ui/sheet';
import ProfileSidebar from './ProfileSidebar'; 

interface ProfileSliderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSlider({ open, onOpenChange }: ProfileSliderProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto p-4">
        <ProfileSidebar />
      </SheetContent>
    </Sheet>
  );
}
