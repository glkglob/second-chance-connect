import * from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder)}
      {...props}
    />
  )
}

export { Textarea }
