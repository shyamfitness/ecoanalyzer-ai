import { forwardRef } from 'react'
import { cn } from '../utils/cn'

const Textarea = forwardRef(({ 
  label, 
  error, 
  helperText,
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-3 min-h-[120px]',
          'bg-white border border-zinc-300 rounded-xl',
          'text-zinc-900 placeholder-zinc-400',
          'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent',
          'transition-all duration-200 resize-y',
          'disabled:bg-zinc-50 disabled:text-zinc-500 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-zinc-500">{helperText}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea