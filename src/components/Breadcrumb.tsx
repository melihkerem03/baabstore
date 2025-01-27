import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
    onClick?: () => void;
  }[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight size={16} className="text-gray-400" />
          )}
          {item.onClick || item.href ? (
            <button
              onClick={item.onClick}
              className="hover:text-gray-800 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-800">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}; 