
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { Home, Users, Briefcase, CheckSquare, BrainCircuit, ClipboardList, Shield } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';

/**
 * The main sidebar component for application navigation.
 * It displays navigation links based on the user's role.
 * @returns {React.ReactElement} The rendered sidebar component.
 */
export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Define the base menu items available to all users.
  const menuItems = [
    { href: '/', label: t('sidebar.dashboard'), icon: Home },
    { href: '/clients', label: t('sidebar.clients'), icon: Users },
    { href: '/opportunities', label: t('sidebar.opportunities'), icon: Briefcase },
    { href: '/tasks', label: t('sidebar.tasks'), icon: CheckSquare },
    { href: '/interactions', label: t('sidebar.interactions'), icon: ClipboardList },
    { href: '/ai-tools/email-generator', label: t('sidebar.ai_email'), icon: BrainCircuit },
  ];

  // Conditionally add the 'Admin' link if the user has the 'admin' role.
  if (user?.role === 'admin') {
    menuItems.push({ href: '/admin', label: t('sidebar.admin'), icon: Shield });
  }

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
                // The button is marked as active if its href matches the current pathname.
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
