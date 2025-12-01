import { cn } from '../utils/cn'

const Skeleton = ({ className = '', variant = 'default', lines = 1 }) => {
  const variants = {
    default: 'bg-zinc-200 rounded-lg',
    text: 'bg-zinc-200 rounded h-4',
    circle: 'bg-zinc-200 rounded-full',
    card: 'bg-white border border-zinc-200 rounded-2xl p-6',
    avatar: 'bg-zinc-200 rounded-full',
  }
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('skeleton', variants.text, i === lines - 1 && 'w-3/4', className)}
          />
        ))}
      </div>
    )
  }
  
  return (
    <div className={cn('skeleton', variants[variant], className)} />
  )
}

export default Skeleton