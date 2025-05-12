import { Button } from "@/components/ui/button";
import { Circle, Square, Squircle } from "lucide-react";

interface TBorderStyleButton {
  borderStyle: string | undefined;
  onBorderStyleChanged: (borderStyle: string) => void;
}

export const BORDER_STYLES = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle",
};

const borderStyles = Object.values(BORDER_STYLES);

const BorderStyleButton = ({
  borderStyle,
  onBorderStyleChanged,
}: TBorderStyleButton) => {
  const handleClick = () => {
    const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0;
    const nextIndex = (currentIndex + 1) % borderStyles.length;

    onBorderStyleChanged(borderStyles[nextIndex]);
  };

  const Icon =
    borderStyle === "square"
      ? Square
      : borderStyle === "circle"
        ? Circle
        : Squircle;

  return (
    <Button
      variant="outline"
      size="icon"
      title="Change border style"
      onClick={handleClick}
    >
      <Icon className="size-5" />
    </Button>
  );
};

export default BorderStyleButton;
