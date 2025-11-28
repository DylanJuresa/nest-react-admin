import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({
  children,
  to,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      to={to}
      className="no-underline bg-brand-primary text-white hover:bg-opacity-90 rounded-md p-3 transition-colors block"
    >
      <span className="flex gap-3 font-semibold items-center justify-center">
        {children} {active ? <ChevronRight /> : null}
      </span>
    </Link>
  );
}
