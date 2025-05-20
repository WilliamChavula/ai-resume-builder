import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { useSubscriptionTier } from "@/app/(main)/_providers/SubscriptionTierProvider";
import usePremiumModal from "@/hooks/use-premium-modal";
import { canUseCustomizations } from "@/lib/permissions";

interface ColorPickerProps {
  color: Color | undefined;
  onColorChange: ColorChangeHandler;
}

const ColorPicker = ({ color, onColorChange }: ColorPickerProps) => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const subscriptionTier = useSubscriptionTier();
  const { setOpen } = usePremiumModal();
  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Change resume color"
          onClick={() => {
            if (!canUseCustomizations(subscriptionTier)) {
              setOpen(true);
              return;
            }
            setShowPopover(true);
          }}
        >
          <Palette className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-none bg-transparent shadow-none"
        align="end"
      >
        <TwitterPicker
          color={color}
          onChange={onColorChange}
          triangle="top-right"
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
