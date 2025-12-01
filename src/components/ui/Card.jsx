import { cn } from '../utils/cn'

const Card = ({ children, className = '', hover = false, glass = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm',
        hover && 'card-hover cursor-pointer',
        glass && 'glass',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card