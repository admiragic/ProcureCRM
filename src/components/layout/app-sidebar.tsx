'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { Home, Users, Briefcase, CheckSquare, BrainCircuit, ClipboardList } from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Nadzorna ploča', icon: Home },
  { href: '/clients', label: 'Klijenti', icon: Users },
  { href: '/opportunities', label: 'Prilike', icon: Briefcase },
  { href: '/tasks', label: 'Zadaci', icon: CheckSquare },
  { href: '/interactions', label: 'Interakcije', icon: ClipboardList },
  { href: '/ai-tools/email-generator', label: 'AI Email', icon: BrainCircuit },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
