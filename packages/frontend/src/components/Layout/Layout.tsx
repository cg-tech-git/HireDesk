import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  Collapse,
  useTheme,
  useMediaQuery,
  Popover,
  Paper,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  DashboardOutlined as DashboardIcon,
  DescriptionOutlined as DescriptionIcon,
  RequestQuoteOutlined as RequestQuoteIcon,
  PeopleOutlined as PeopleIcon,
  SettingsOutlined as SettingsIcon,
  LogoutOutlined as LogoutIcon,
  AssignmentOutlined as AssignmentIcon,
  AdminPanelSettingsOutlined as AdminIcon,
  ShoppingCartOutlined as ShoppingCartIcon,
  BuildOutlined as BuildCircleIcon,
  ChevronRight as ChevronRightIcon,
  EngineeringOutlined as EngineeringIcon,
  AddHomeWorkOutlined as AddHomeWorkIcon,
  PaletteOutlined as PaletteIcon,
  PolicyOutlined as PolicyIcon,
  GavelOutlined as GavelIcon,
  ArticleOutlined as ArticleIcon,
  HelpOutlineOutlined as HelpIcon,
  FeedbackOutlined as FeedbackIcon,
  PersonOutlineOutlined as PersonIcon,
  EmailOutlined as EmailIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useBasket } from '@/contexts/BasketContext';
import { UserRole } from '@hiredesk/shared';
import Badge from '@mui/material/Badge';
import { toast } from 'react-hot-toast';
import { colors } from '@/styles/colors';
import { FloatingQuoteCart } from '@/components/QuoteCart/FloatingQuoteCart';
import { QuoteManager } from '@/components/QuoteCart/QuoteManager';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const drawerWidth = 280;
const drawerWidthCollapsed = 64;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { userProfile, logout } = useAuth();
  const { getItemCount } = useBasket();
  const quoteItems = useSelector((state: RootState) => state.quote.items);
  const hasQuoteItems = quoteItems.length > 0;
  
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const [subMenuAnchor, setSubMenuAnchor] = React.useState<{
    element: HTMLElement | null;
    item: string | null;
  }>({ 
    element: null, 
    item: null 
  });
  const mainContentRef = React.useRef<HTMLElement>(null);

  // Scroll to top when pathname changes
  React.useEffect(() => {
    // Scroll window
    window.scrollTo(0, 0);
    
    // Scroll document
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Scroll main content if it exists
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    
    // Force scroll on all scrollable elements
    const scrollableElements = document.querySelectorAll('*');
    scrollableElements.forEach((el) => {
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTop = 0;
      }
    });
  }, [router.pathname]);

  // Update open state based on hover and mobile status
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setOpen(!open);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      setOpen(false);
      // Reset expanded menus when drawer collapses
      setExpandedMenus({});
    }
  };

  const handleMenuExpand = (text: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [text]: !prev[text]
    }));
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    router.push('/login');
  };

  const handleNavigation = (path: string) => {
    // Settings page 
    if (path === '/settings') {
      toast.success('Settings page coming soon');
      return;
    }
    
    // New sections
    if (path === '/sales-rental' || path === '/epc') {
      toast.success('This section is coming soon');
      return;
    }
    
    // Check if it's one of the new category pages
    if (path.startsWith('/modular-cabins') ||
        path.startsWith('/site-mobility') ||
        path.startsWith('/site-overlay') ||
        path.startsWith('/event-infrastructure') ||
        path.startsWith('/event-seating') ||
        path.startsWith('/construction-scaffolding') ||
        path.startsWith('/vertical-access')) {
      toast.success('This section is coming soon');
      return;
    }
    
    router.push(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleSubMenuOpen = (event: React.MouseEvent<HTMLElement>, item: string) => {
    event.stopPropagation();
    setSubMenuAnchor({
      element: event.currentTarget,
      item: item
    });
  };

  const handleSubMenuClose = () => {
    setSubMenuAnchor({ element: null, item: null });
  };

  const isSubMenuOpen = Boolean(subMenuAnchor.element);
  const currentSubMenuItem = subMenuAnchor.item;

  const menuItems = [
    { 
      value: 'Demo User',
      icon: <PersonIcon fontSize="medium" />,
      isDivider: false,
      menuType: 'user'
    },
    { 
      value: 'demo@example.com',
      icon: <EmailIcon fontSize="medium" />,
      isDivider: true,
      menuType: 'user'
    },
    { 
      label: 'Theme',
      icon: <PaletteIcon fontSize="medium" />,
      action: () => toast.success('Theme settings coming soon'),
      isDivider: false,
      menuType: 'both'
    },
    { 
      label: 'Privacy Policy',
      icon: <PolicyIcon fontSize="medium" />,
      action: () => toast.success('Privacy Policy page coming soon'),
      isDivider: false,
      menuType: 'both'
    },
    { 
      label: 'Terms of Service',
      icon: <ArticleIcon fontSize="medium" />,
      action: () => toast.success('Terms of Service page coming soon'),
      isDivider: false,
      menuType: 'both'
    },
    { 
      label: 'Help and Support',
      icon: <HelpIcon fontSize="medium" />,
      action: () => toast.success('Help and Support page coming soon'),
      isDivider: false,
      menuType: 'both'
    },
    { 
      label: 'Send Feedback',
      icon: <FeedbackIcon fontSize="medium" />,
      action: () => toast.success('Feedback form coming soon'),
      isDivider: false,
      menuType: 'both'
    },
  ];

  const renderMenuItems = (handleClose: () => void, menuType: 'user' | 'settings') => (
    <>
      {menuItems
        .filter(item => item.menuType === 'both' || item.menuType === menuType)
        .map((item, index) => (
          <React.Fragment key={item.value || item.label}>
            {item.value ? (
              <MenuItem onClick={handleClose} disabled>
                <ListItemIcon sx={{ minWidth: 36, color: '#183057' }}>
                  {item.icon}
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontSize: '14px' }}>
                  {item.value}
                </Typography>
              </MenuItem>
            ) : (
              <MenuItem 
                onClick={() => {
                  handleClose();
                  item.action?.();
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: '#183057' }}>
                  {item.icon}
                </ListItemIcon>
                <Typography sx={{ fontSize: '14px' }}>
                  {item.label}
                </Typography>
              </MenuItem>
            )}
            {item.isDivider && <Divider />}
          </React.Fragment>
        ))}
    </>
  );

  // Navigation items based on user role
  const getNavigationItems = () => {
    const items = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
        roles: [UserRole.CUSTOMER, UserRole.HIRE_DESK, UserRole.ADMIN],
      },
      {
        text: 'Sales & Rental',
        icon: <AddHomeWorkIcon />,
        path: null,
        roles: [UserRole.CUSTOMER, UserRole.HIRE_DESK, UserRole.ADMIN],
        children: [
          {
            text: 'Aerial Work Platforms',
            icon: <BuildCircleIcon />,
            path: '/aerial-work-platforms',
          },
          {
            text: 'Modular Cabins',
            icon: <BuildCircleIcon />,
            path: '/modular-cabins',
          },
          {
            text: 'Site Mobility',
            icon: <BuildCircleIcon />,
            path: '/site-mobility',
          },
          {
            text: 'Site Overlay',
            icon: <BuildCircleIcon />,
            path: '/site-overlay',
          },
        ],
      },
      {
        text: 'EPC',
        icon: <EngineeringIcon />,
        path: null,
        roles: [UserRole.CUSTOMER, UserRole.HIRE_DESK, UserRole.ADMIN],
        children: [
          {
            text: 'Event Infrastructure',
            icon: <BuildCircleIcon />,
            path: '/event-infrastructure',
          },
          {
            text: 'Event Seating',
            icon: <BuildCircleIcon />,
            path: '/event-seating',
          },
          {
            text: 'Construction Scaffolding',
            icon: <BuildCircleIcon />,
            path: '/construction-scaffolding',
          },
          {
            text: 'Vertical Access',
            icon: <BuildCircleIcon />,
            path: '/vertical-access',
          },
        ],
      },
      {
        text: 'Hire Desk',
        icon: <AssignmentIcon />,
        path: '/hire-desk',
        roles: [UserRole.HIRE_DESK, UserRole.ADMIN],
      },
      {
        text: 'Administration',
        icon: <AdminIcon />,
        path: null,
        roles: [UserRole.ADMIN],
        children: [
          {
            text: 'Users',
            icon: <PeopleIcon />,
            path: '/admin/users',
          },
          {
            text: 'Rate Cards',
            icon: <DescriptionIcon />,
            path: '/admin/rate-cards',
          },
          {
            text: 'Templates',
            icon: <DescriptionIcon />,
            path: '/admin/templates',
          },
          {
            text: 'Settings',
            icon: <SettingsIcon />,
            path: '/admin/settings',
          },
        ],
      },
      {
        text: 'My Quotes',
        icon: <DescriptionIcon />,
        path: '/quotes',
        roles: [UserRole.CUSTOMER],
      },
    ];

    return items.filter(item => 
      !item.roles || item.roles.includes(userProfile?.role || UserRole.CUSTOMER)
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${open ? drawerWidth : drawerWidthCollapsed}px)` },
          ml: { sm: `${open ? drawerWidth : drawerWidthCollapsed}px` },
          backgroundColor: 'white',
          color: '#183057',
          boxShadow: 'none',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: '1.3rem',
              fontWeight: 600,
              color: '#183057',
            }}
          >
            HireDesk
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="text"
              disabled
              sx={{
                color: '#183057',
                borderRadius: '50px',
                px: 3,
                opacity: 0.5,
                '&.Mui-disabled': {
                  color: '#183057',
                },
              }}
            >
              Register
            </Button>
            <Button
              variant="text"
              disabled
              sx={{
                color: '#183057',
                borderRadius: '50px',
                px: 3,
                opacity: 0.5,
                '&.Mui-disabled': {
                  color: '#183057',
                },
              }}
            >
              Login
            </Button>
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                opacity: 0.7,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: '#f5f5f5',
                  color: '#183057',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                HD
              </Avatar>
            </IconButton>
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {renderMenuItems(handleUserMenuClose, 'user')}
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={handleDrawerToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          width: open ? drawerWidth : drawerWidthCollapsed,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : drawerWidthCollapsed,
            boxSizing: 'border-box',
            transition: theme.transitions.create(['width', 'background-color'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            backgroundColor: '#f8fafc',
            borderRight: '0px solid transparent !important',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-end' : 'center',
            px: [1],
          }}
        >
          {isMobile && open && (
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Toolbar>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
          <List component="nav" sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {getNavigationItems().map((item, index) => (
              <React.Fragment key={index}>
                {item.children ? (
                  <>
                    <ListItemButton
                      onClick={(event) => handleSubMenuOpen(event, item.text)}
                      selected={currentSubMenuItem === item.text}
                      sx={{ 
                        justifyContent: open ? 'initial' : 'center',
                        minHeight: 48,
                        mx: open ? 2 : 1,
                        borderRadius: '24px',
                        '&.Mui-selected': {
                          backgroundColor: colors.blue[50],
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          borderRadius: '24px',
                        },
                      }}
                    >
                      <ListItemIcon 
                        sx={{ 
                          minWidth: open ? 56 : 'auto',
                          justifyContent: 'center',
                          color: currentSubMenuItem === item.text ? '#183057' : '#183057',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {open && (
                        <>
                          <ListItemText 
                            primary={item.text}
                            sx={{
                              color: currentSubMenuItem === item.text ? '#183057' : '#183057',
                              '& .MuiTypography-root': {
                                fontWeight: currentSubMenuItem === item.text ? 500 : 400,
                                fontSize: '14px',
                              },
                            }}
                          />
                          <ChevronRightIcon 
                            sx={{
                              color: currentSubMenuItem === item.text ? '#183057' : '#183057',
                            }}
                          />
                        </>
                      )}
                    </ListItemButton>
                    <Popover
                      open={isSubMenuOpen && currentSubMenuItem === item.text}
                      anchorEl={subMenuAnchor.element}
                      onClose={handleSubMenuClose}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      sx={{
                        '& .MuiPaper-root': {
                          marginLeft: -1,
                          borderRadius: 4,
                          boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.05)',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#fcfcfd',
                          width: 280,
                          py: 1,
                        },
                      }}
                    >
                      {item.children.map((child, childIndex) => (
                        <ListItemButton
                          key={childIndex}
                          onClick={() => {
                            handleNavigation(child.path);
                            handleSubMenuClose();
                          }}
                          selected={router.pathname === child.path}
                          sx={{ 
                            pl: 3,
                            minHeight: 48,
                            mx: 2,
                            borderRadius: '24px',
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              borderRadius: '24px',
                            },
                          }}
                        >
                          <ListItemIcon 
                            sx={{
                              color: router.pathname === child.path ? '#183057' : '#183057',
                            }}
                          >
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={child.text}
                            sx={{
                              color: router.pathname === child.path ? '#183057' : '#183057',
                              '& .MuiTypography-root': {
                                fontWeight: router.pathname === child.path ? 500 : 400,
                                fontSize: '14px',
                              },
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </Popover>
                  </>
                ) : (
                  <ListItemButton
                    onClick={() => item.path && handleNavigation(item.path)}
                    selected={router.pathname === item.path}
                    sx={{ 
                      justifyContent: open ? 'initial' : 'center',
                      minHeight: 48,
                      mx: open ? 2 : 1,
                      borderRadius: '24px',
                      '&.Mui-selected': {
                        backgroundColor: colors.blue[50],
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        borderRadius: '24px',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: open ? 56 : 'auto',
                        justifyContent: 'center',
                        color: router.pathname === item.path ? '#183057' : '#183057',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText 
                        primary={item.text}
                        sx={{
                          color: router.pathname === item.path ? '#183057' : '#183057',
                          '& .MuiTypography-root': {
                            fontWeight: router.pathname === item.path ? 500 : 400,
                            fontSize: '14px',
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                )}
              </React.Fragment>
            ))}
          </List>
          
          {/* Settings at the bottom */}
          <Box sx={{ mt: 'auto', pb: 2 }}>
            <Divider sx={{ mx: 2, mb: 2 }} />
            <ListItemButton
              onClick={handleSettingsMenuOpen}
              sx={{ 
                justifyContent: open ? 'initial' : 'center',
                minHeight: 48,
                mx: open ? 2 : 1,
                borderRadius: '24px',
                '&.Mui-selected': {
                  backgroundColor: colors.blue[50],
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderRadius: '24px',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: open ? 56 : 'auto',
                  justifyContent: 'center',
                  color: Boolean(settingsMenuAnchor) ? '#183057' : '#183057',
                }}
              >
                <SettingsIcon />
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary="Settings"
                  sx={{
                    color: Boolean(settingsMenuAnchor) ? '#183057' : '#183057',
                    '& .MuiTypography-root': {
                      fontWeight: Boolean(settingsMenuAnchor) ? 500 : 400,
                      fontSize: '14px',
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Box>

          {/* Settings Menu */}
          <Menu
            anchorEl={settingsMenuAnchor}
            open={Boolean(settingsMenuAnchor)}
            onClose={handleSettingsMenuClose}
            PaperProps={{
              sx: {
                marginLeft: -1,
                borderRadius: 4,
                boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.05)',
                width: 280,
                backgroundColor: '#fcfcfd',
                border: '1px solid #e2e8f0',
                '& .MuiList-root': {
                  py: 1,
                },
              },
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPaper-root': {
                marginLeft: -1,
                marginTop: '-48px',
              },
            }}
          >
            {renderMenuItems(handleSettingsMenuClose, 'settings')}
          </Menu>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        ref={mainContentRef}
        sx={{
          flexGrow: 1,
          px: 3,
          pb: 3,
          pt: 0,
          width: { sm: `calc(100% - ${open ? drawerWidth : drawerWidthCollapsed}px)` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
      
      {/* Floating Quote Cart - only shows when there are items */}
      {hasQuoteItems && <FloatingQuoteCart />}
      
      {/* Quote Manager - handles global quote workflow */}
      <QuoteManager />
    </Box>
  );
}; 