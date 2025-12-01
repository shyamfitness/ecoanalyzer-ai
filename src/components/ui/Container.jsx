import { cn } from '../utils/cn'

const Container = ({ children, className = '', maxWidth = '7xl', padding = true }) => {
  const maxWidthClasses = {
    'sm': 'max-w-screen-sm',
    'md': 'max-w-screen-md',
    'lg': 'max-w-screen-lg',
    'xl': 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '7xl': 'max-w-7xl',
  }
  
  return (
    <div className={cn(
      'mx-auto',
      padding && 'px-4 sm:px-6 lg:px-8',
      maxWidthClasses[maxWidth] || maxWidthClasses['7xl'],
      className
    )}>
      {children}
    </div>
  )
}

export default Container