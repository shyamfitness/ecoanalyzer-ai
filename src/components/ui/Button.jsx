import { forwardRef } from 'react'
import { cn } from '../utils/cn'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
  
  const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900 shadow-sm hover:shadow-md',
    secondary: 'bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50 focus:ring-zinc-900 shadow-sm hover:shadow-md',
    ghost: 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-900',
    outline: 'border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white focus:ring-zinc-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm hover:shadow-md',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
    xl: 'px-10 py-5 text-xl rounded-xl',
  }
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button