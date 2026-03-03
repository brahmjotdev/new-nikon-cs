// ==============================
// Imports
// ==============================

"use client";

import * as React from "react";
import { cn } from "@/utils";

import { DivElementProps } from "@/types";
import { Button, ButtonProps } from "./button";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

// ==============================
// Props
// ==============================

const SIDEBAR_WIDTH = 64;
const SIDEBAR_COLLAPSED_WIDTH = 16;

const sidebarWidths = {
  default: SIDEBAR_WIDTH,
  icon: SIDEBAR_COLLAPSED_WIDTH,
  none: 0,
};

interface SidebarWrapperProps extends DivElementProps {}
interface SidebarProps extends DivElementProps {
  collapsible?: keyof typeof sidebarWidths;
  collapse?: boolean;
  onCollapseChange?: (collapse: boolean) => void;
}
interface SidebarTriggerProps extends ButtonProps {}
interface SidebarHeaderProps extends DivElementProps {}
interface SidebarBodyProps extends DivElementProps {}
interface SidebarMenuProps extends DivElementProps {}
interface SidebarLinkProps extends LinkProps {
  className?: string;
  children?: React.ReactNode;
}
interface SidebarFooterProps extends DivElementProps {}

// ==============================
// Component
// ==============================

const SidebarWrapper = React.forwardRef<HTMLDivElement, SidebarWrapperProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar-wrapper"
        className={cn("flex h-screen", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      collapsible = "default",
      collapse = false,
      onCollapseChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar"
        data-collapsible={collapsible}
        data-state={collapse ? "collapsed" : "expanded"}
        className={cn(
          "bg-sidebar h-screen p-4",
          `w-${sidebarWidths[collapsible]}`,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        data-slot="sidebar-trigger"
        className={cn("", className)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar-header"
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const SidebarBody = React.forwardRef<HTMLDivElement, SidebarBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar-body"
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const SidebarMenu = React.forwardRef<HTMLDivElement, SidebarMenuProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar-menu"
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const SidebarLink = React.forwardRef<HTMLAnchorElement, SidebarLinkProps>(
  ({ href, className, children, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
      <Link
        ref={ref}
        data-slot="sidebar-link"
        href={href}
        className={cn(
          "rounded-md p-2 [&_svg]:size-5 [&_svg]:shrink-0 overflow-hidden text-sm font-medium flex items-center gap-2 text-muted-foreground",
          isActive ? "bg-secondary text-secondary-foreground" : "",
          className,
        )}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar-footer"
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// ==============================
// Exports
// ==============================

SidebarWrapper.displayName = "SidebarWrapper";
Sidebar.displayName = "Sidebar";
SidebarTrigger.displayName = "SidebarTrigger";
SidebarHeader.displayName = "SidebarHeader";
SidebarBody.displayName = "SidebarBody";
SidebarMenu.displayName = "SidebarMenu";
SidebarLink.displayName = "SidebarLink";
SidebarFooter.displayName = "SidebarFooter";

export {
  SidebarWrapper,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarBody,
  SidebarMenu,
  SidebarLink,
  SidebarFooter,
};
