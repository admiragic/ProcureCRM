/**
 * @file This file defines the main header component for the application.
 * It includes the sidebar trigger for mobile, a search bar, and user-related controls.
 */

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"

/**
 * The main header component for the application layout.
 * @returns {React.ReactElement} The rendered header component.
 */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      {/* Sidebar trigger, only visible on mobile screens */}
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      {/* Search input form */}
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pretražite klijente, zadatke..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      {/* Action controls on the right side of the header */}
      <LanguageSwitcher />
      <ThemeSwitcher />
      <UserNav />
    </header>
  )
}
