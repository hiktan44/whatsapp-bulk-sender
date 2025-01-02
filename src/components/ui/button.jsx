import React from "react";

const Button = React.forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300",
    outline: "border border-purple-600 text-purple-600 hover:bg-purple-50 disabled:border-purple-300 disabled:text-purple-300",
    ghost: "text-purple-600 hover:bg-purple-50 disabled:text-purple-300",
    secondary: "bg-purple-100 text-purple-900 hover:bg-purple-200 disabled:bg-purple-50 disabled:text-purple-300",
    destructive: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };