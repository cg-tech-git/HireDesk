import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Construction as ConstructionIcon,
  Description as DescriptionIcon,
  ExpandLess,
  ExpandMore,
  Category as CategoryIcon,
  BuildCircle as BuildCircleIcon,
  RequestQuote as RequestQuoteIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useBasket } from '@/contexts/BasketContext';
import { UserRole } from '@hiredesk/shared';
import Badge from '@mui/material/Badge';

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
  
  const [open, setOpen] = useState(!isMobile);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleEquipmentClick = () => {
    setEquipmentOpen(!equipmentOpen);
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
    router.push(path);
    if (isMobile) {
      setOpen(false);
    }
  };

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
        text: 'Equipment Catalog',
        icon: <ConstructionIcon />,
        path: null,
        roles: [UserRole.CUSTOMER, UserRole.HIRE_DESK, UserRole.ADMIN],
        children: [
          {
            text: 'Browse Equipment',
            icon: <CategoryIcon />,
            path: '/equipment',
          },
          {
            text: 'Categories',
            icon: <BuildCircleIcon />,
            path: '/equipment/categories',
          },
        ],
      },
      {
        text: 'My Quotes',
        icon: <DescriptionIcon />,
        path: '/quotes',
        roles: [UserRole.CUSTOMER],
      },
      {
        text: 'RFQ Basket',
        icon: (
          <Badge badgeContent={getItemCount()} color="primary">
            <RequestQuoteIcon />
          </Badge>
        ),
        path: '/basket',
        roles: [UserRole.CUSTOMER],
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
          color: 'black',
          boxShadow: 'none',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: '1.3rem',
              fontWeight: 600,
            }}
          >
            HireDesk
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Basket Icon in Header */}
            {userProfile?.role === UserRole.CUSTOMER && (
              <IconButton
                color="inherit"
                onClick={() => handleNavigation('/basket')}
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={getItemCount()} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}

            <Typography variant="body2" sx={{ mr: 2 }}>
              {userProfile?.name}
            </Typography>
            <IconButton onClick={handleUserMenuOpen} size="small">
              <Avatar sx={{ width: 32, height: 32 }}>
                {userProfile?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
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
        sx={{
          width: open ? drawerWidth : drawerWidthCollapsed,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : drawerWidthCollapsed,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
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
          {open && (
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Toolbar>
        
        <Divider />
        
        <List component="nav">
          {getNavigationItems().map((item, index) => (
            <React.Fragment key={index}>
              {item.children ? (
                <>
                  <ListItemButton
                    onClick={item.text === 'Equipment Catalog' ? handleEquipmentClick : undefined}
                    sx={{ justifyContent: open ? 'initial' : 'center' }}
                  >
                    <ListItemIcon sx={{ minWidth: open ? 56 : 'auto' }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <>
                        <ListItemText primary={item.text} />
                        {item.text === 'Equipment Catalog' && (equipmentOpen ? <ExpandLess /> : <ExpandMore />)}
                      </>
                    )}
                  </ListItemButton>
                  {open && (
                    <Collapse in={equipmentOpen && item.text === 'Equipment Catalog'} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((child, childIndex) => (
                          <ListItemButton
                            key={childIndex}
                            sx={{ pl: 4 }}
                            onClick={() => handleNavigation(child.path)}
                            selected={router.pathname === child.path}
                          >
                            <ListItemIcon>{child.icon}</ListItemIcon>
                            <ListItemText primary={child.text} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </>
              ) : (
                <ListItemButton
                  onClick={() => item.path && handleNavigation(item.path)}
                  selected={router.pathname === item.path}
                  sx={{ justifyContent: open ? 'initial' : 'center' }}
                >
                  <ListItemIcon sx={{ minWidth: open ? 56 : 'auto' }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} />}
                </ListItemButton>
              )}
            </React.Fragment>
          ))}
        </List>
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