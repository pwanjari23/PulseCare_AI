import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { IconChevronRight, IconHome } from '../../icons';

export const Breadcrumb = React.forwardRef(({ items = [], className, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs text-text-muted', className)}
      {...props}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            to="/dashboard"
            className="hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <IconHome size={12} />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <li className="flex items-center text-text-disabled" aria-hidden="true">
                <IconChevronRight size={12} />
              </li>
              <li>
                {isLast ? (
                  <span className="font-medium text-text-primary" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href || '#'}
                    className="hover:text-text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
