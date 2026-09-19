import React from 'react';
import {
  Calendar,
  Home,
  User,
  Briefcase,
  FileText,
  BrainCog,
  Settings,
  HelpCircle,
  LogOut,
  Code2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Dashboard",
    url: "/app",
    icon: Home,
  },
  {
    title: "Interview",
    url: "/app/interview",
    icon: BrainCog,
    active: true,
  },
  {
    title: "Top 75 LeetCode",
    url: "/app/top75",
    icon: Code2,
  },
  {
    title: "Resume",
    url: "/app/resume",
    icon: FileText,
  },
  {
    title: "Job Recommentation",
    url: "/app/job",
    icon: Briefcase,
  },
];

const generalItems = [
  {
    title: "Profile",
    url: "/app/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/app/settings",
    icon: Settings,
  },
];

import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@/context/UserContext';

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearUser } = useUser();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL_NODE}/api/users/logout`);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearUser();
      navigate('/login');
    }
  };

  return (
    <div className="relative h-full">
      <Sidebar className="bg-white text-gray-600 border-r border-gray-100 h-full flex flex-col">
        <SidebarContent className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-4 py-4 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base font-bold text-white">H</span>
            <span className="truncate font-semibold text-lg text-ink">Hire Pulse.</span>
          </div>

          {/* Main menu */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all ${
                          location.pathname === item.url
                            ? "bg-primary text-white"
                            : "text-gray-500 hover:bg-primary-tint hover:text-ink"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* General menu */}
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              General
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {generalItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all ${
                          location.pathname === item.url
                            ? "bg-primary text-white"
                            : "text-gray-500 hover:bg-primary-tint hover:text-ink"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Dotted pattern background */}
          <div className="relative flex-grow overflow-hidden">
            <div className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                backgroundSize: '12px 12px'
              }} />
          </div>

          {/* User chip */}
          {user && (
            <div className="px-4 pb-2">
              <div className="flex items-center gap-3 bg-secondary border border-gray-100 rounded-xl px-3 py-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-tint flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-ink text-xs font-semibold truncate">{user.name}</p>
                  <p className="text-gray-400 text-[10px] truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Logout button */}
          <div className="mb-4 px-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-full text-gray-500 hover:bg-destructive/10 hover:text-destructive transition-all w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Log Out</span>
            </button>
          </div>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}