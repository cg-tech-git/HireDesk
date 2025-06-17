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
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useBasket } from '@/contexts/BasketContext';
import { UserRole } from '@hiredesk/shared';
import Badge from '@mui/material/Badge';
import { toast } from 'react-hot-toast';
import { colors } from '@/styles/colors';

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
  
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const [subMenuAnchor, setSubMenuAnchor] = useState<{
    element: HTMLElement | null;
    item: string | null;
  }>({ element: null, item: null });

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
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
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
          color: colors.gemini.text,
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
              color: colors.gemini.text,
            }}
          >
            HireDesk
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!userProfile ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/login')}
                  sx={{
                    borderColor: '#155799',
                    color: '#155799',
                    '&:hover': {
                      borderColor: '#159957',
                      backgroundColor: 'rgba(21, 153, 87, 0.04)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => router.push('/register')}
                  sx={{
                    background: 'linear-gradient(to right, #155799, #159957)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(to right, #1a6ab8, #1ab86a)',
                    },
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {userProfile?.name}
                </Typography>
                <IconButton onClick={handleUserMenuOpen} size="small">
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {userProfile?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </>
            )}
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
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
            <MenuItem onClick={() => handleNavigation('/profile')}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
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
            backgroundColor: colors.gemini.background,
            borderRight: '0px solid transparent !important',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: colors.gemini.background,
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
                          color: currentSubMenuItem === item.text ? colors.blue[600] : colors.gemini.textSecondary,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {open && (
                        <>
                          <ListItemText 
                            primary={item.text}
                            sx={{
                              color: currentSubMenuItem === item.text ? colors.blue[600] : colors.gemini.text,
                              '& .MuiTypography-root': {
                                fontWeight: currentSubMenuItem === item.text ? 500 : 400,
                              },
                            }}
                          />
                          <ChevronRightIcon 
                            sx={{
                              color: currentSubMenuItem === item.text ? colors.blue[600] : colors.gemini.textSecondary,
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
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                      slotProps={{
                        paper: {
                          sx: {
                            width: 280,
                            backgroundColor: '#f8fafc',
                          }
                        }
                      }}
                    >
                      <Paper 
                        elevation={0}
                        sx={{ 
                          backgroundColor: 'inherit',
                          py: 1,
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
                                color: router.pathname === child.path ? colors.blue[600] : colors.gemini.textSecondary,
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={child.text}
                              sx={{
                                color: router.pathname === child.path ? colors.blue[600] : colors.gemini.text,
                                '& .MuiTypography-root': {
                                  fontWeight: router.pathname === child.path ? 500 : 400,
                                },
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </Paper>
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
                        color: router.pathname === item.path ? colors.blue[600] : colors.gemini.textSecondary,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText 
                        primary={item.text}
                        sx={{
                          color: router.pathname === item.path ? colors.blue[600] : colors.gemini.text,
                          '& .MuiTypography-root': {
                            fontWeight: router.pathname === item.path ? 500 : 400,
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
              onClick={() => handleNavigation('/settings')}
              selected={router.pathname === '/settings'}
              sx={{ 
                justifyContent: open ? 'initial' : 'center',
                minHeight: 48,
                mx: open ? 2 : 1,
                borderRadius: '24px',
                '&.Mui-selected': {
                  backgroundColor: colors.blue[50],
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: open ? 56 : 'auto',
                  justifyContent: 'center',
                  color: router.pathname === '/settings' ? colors.blue[600] : colors.gemini.textSecondary,
                }}
              >
                <SettingsIcon />
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary="Settings"
                  sx={{
                    color: router.pathname === '/settings' ? colors.blue[600] : colors.gemini.text,
                    '& .MuiTypography-root': {
                      fontWeight: router.pathname === '/settings' ? 500 : 400,
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: 3,
          pr: 3,
          pb: 3,
          pt: 0,
          width: { sm: `calc(100% - ${open ? drawerWidth : drawerWidthCollapsed}px)` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}; 