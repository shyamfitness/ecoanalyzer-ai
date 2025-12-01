const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-6">
          <Icon size={32} className="text-zinc-400" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-zinc-900 mb-2">{title}</h3>
      {description && (
        <p className="text-zinc-600 max-w-md mb-6">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState