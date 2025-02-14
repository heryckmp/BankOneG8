import { cn } from '@/lib/utils'
import React from 'react'

interface HeaderBoxProps {
  type?: 'title' | 'greeting';
  title: string;
  subtext: string;
  user?: string;
}

const HeaderBox = ({ 
  type = 'title',
  title,
  subtext,
  user
}: HeaderBoxProps) => {
  return (
    <div className="header-box">
      <div className="header-box-title">
        {type === 'greeting' ? (
          <div className="flex items-center gap-2">
            <h1>{title}</h1>
            <span className="text-blue-600">{user}</span>
          </div>
        ) : (
          <h1>{title}</h1>
        )}
      </div>
      <p className="header-box-subtext">
        {subtext}
      </p>
    </div>
  )
}

export default HeaderBox