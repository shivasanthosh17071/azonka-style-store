import type { ReactNode } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
  footerLabel = "Done",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footerLabel?: string;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="font-display text-2xl">{title}</DrawerTitle>
        </DrawerHeader>
        <div className="max-h-[55vh] overflow-y-auto px-4 pb-2">{children}</div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="h-11 rounded-none bg-brick text-xs uppercase tracking-[0.16em] hover:bg-brick-dark">{footerLabel}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
