"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  Tooltip,
  Switch,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  LogOut as LogOutIcon,
  BarChart3,
  Users,
  FileText,
  Package,
  Settings,
  Wrench,
  Sun,
  Moon,
  LayoutDashboard,
  Search,
  ChevronDown,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { useAuthActions } from '@/lib/firebase/useAuthActions';
import { motion } from 'framer-motion';
import { useTheme as useThemeContext } from '@/lib/theme/ThemeContext';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Analytics': true,
    'Manage': true,
    'Tools': true,
    'Settings': true,
  });
  const { user, role } = useAuth();
  const { logout } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();
  const { mode, toggleTheme } = useThemeContext();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSectionToggle = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const navigationSections = [
    {
      name: 'Analytics',
      items: [
        {
          name: 'Overview',
          href: '/admin/analytics/overview',
          icon: <BarChart3 size={20} />,
        },
        {
          name: 'Uptime',
          href: '/admin/analytics/uptime',
          icon: <Activity size={20} />,
        },
        {
          name: 'Products',
          href: '/admin/analytics/products',
          icon: <Package size={20} />,
        },
        {
          name: 'Content',
          href: '/admin/analytics/content',
          icon: <FileText size={20} />,
        },
        {
          name: 'Users',
          href: '/admin/analytics/users',
          icon: <Users size={20} />,
        },
      ],
    },
    {
      name: 'Manage',
      items: [
        {
          name: 'Users',
          href: '/admin/manage/users',
          icon: <Users size={20} />,
        },
        {
          name: 'Client Onboarding',
          href: '/admin/onboarding',
          icon: <Users size={20} />,
        },
        {
          name: 'Content Approvals',
          href: '/admin/content/approvals',
          icon: <FileText size={20} />,
        },
        {
          name: 'Create Content',
          href: '/admin/content/create',
          icon: <FileText size={20} />,
        },
      ],
    },
    {
      name: 'Tools',
      items: [
        {
          name: 'Yelp Lead Miner',
          href: '/admin/tools/yelp-lead-miner',
          icon: <Search size={20} />,
        },
      ],
    },
    {
      name: 'Settings',
      items: [
        {
          name: 'General',
          href: '/admin/settings/general',
          icon: <Settings size={20} />,
        },
        {
          name: 'Security',
          href: '/admin/settings/security',
          icon: <Settings size={20} />,
        },
      ],
    },
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap component="div">
          Admin Dashboard
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {navigationSections.map((section) => (
          <Box key={section.name}>
            <ListItemButton 
              onClick={() => handleSectionToggle(section.name)}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiListItemText-primary': {
                  color: 'text.primary',
                },
              }}
            >
              <ListItemText 
                primary={section.name} 
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  fontWeight: 'medium',
                }}
              />
              {expandedSections[section.name] ? (
                <ChevronDown size={16} className="lucide-icon" />
              ) : (
                <ChevronRight size={16} className="lucide-icon" />
              )}
            </ListItemButton>
            <Collapse in={expandedSections[section.name]}>
              <List component="div" disablePadding>
                {section.items.map((item) => (
                    <ListItemButton
                    key={item.name}
                      selected={pathname === item.href}
                      onClick={() => router.push(item.href)}
                      sx={{
                      pl: 4,
                        '&.Mui-selected': {
                        backgroundColor: 'action.selected',
                          '&:hover': {
                          backgroundColor: 'action.selected',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      '& .MuiListItemText-primary': {
                        color: 'text.primary',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'text.primary',
                      },
                      }}
                    >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                    <ListItemText primary={item.name} />
                    </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Toggle theme">
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                sx={{
                  '& .lucide-icon': {
                    color: 'text.primary',
                  },
                  '& .sun-icon': {
                    color: 'warning.light',
                    '& path, & circle, & line': {
                      stroke: 'warning.light',
                      strokeWidth: 2,
                    },
                  },
                  '& .moon-icon': {
                    color: 'primary.light',
                    '& path, & circle, & line': {
                      stroke: 'primary.light',
                      strokeWidth: 2,
                    },
                  },
                }}
              >
                {mode === 'dark' ? (
                  <Sun size={20} className="lucide-icon sun-icon" />
                ) : (
                  <Moon size={20} className="lucide-icon moon-icon" />
                )}
              </IconButton>
              </Tooltip>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={anchorEl ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={anchorEl ? 'true' : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.displayName?.[0] || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
            </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogOutIcon size={20} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
        </Toolbar>
      </AppBar>
        <Box
          component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        >
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
            keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: '64px',
          }}
        >
          {children}
        </Box>
      </Box>
  );
} 