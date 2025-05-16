import { Button, ButtonProps } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}
const LoadingButton = (props: LoadingButtonProps) => {
  const { loading, disabled, className, ...rest } = props;
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...rest}
    >
      {loading && <Loader className="mr-2 size-4 animate-spin" />}
      {rest.children}
    </Button>
  );
};

export default LoadingButton;
