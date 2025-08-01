
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { Home, Users, Briefcase, CheckSquare, BrainCircuit, ClipboardList } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    { href: '/', label: t('sidebar.dashboard'), icon: Home },
    { href: '/clients', label: t('sidebar.clients'), icon: Users },
    { href: '/opportunities', label: t('sidebar.opportunities'), icon: Briefcase },
    { href: '/tasks', label: t('sidebar.tasks'), icon: CheckSquare },
    { href: '/interactions', label: t('sidebar.interactions'), icon: ClipboardList },
    { href: '/ai-tools/email-generator', label: t('sidebar.ai_email'), icon: BrainCircuit },
  ];

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
