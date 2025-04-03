import React from "react";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";

interface SubmitButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({
  isLoading,
  className,
  children,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <>
          <Spinner /> Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
