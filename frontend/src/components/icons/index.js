import React from 'react';
import {
  Activity,
  Check,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
  Calendar,
  Search,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Plus,
  Trash,
  Loader2,
  Info,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
  ArrowLeft,
  ArrowRight,
  Menu,
  Settings,
  Home,
  Clipboard,
  ShieldAlert,
  HelpCircle,
  Upload,
  UserCheck,
  Building,
  HeartPulse,
} from 'lucide-react';

// Create consistent props wrapper for each icon
const createIcon = (IconComponent) => {
  return React.forwardRef(({ className, size = 18, strokeWidth = 2, ...props }, ref) => {
    return React.createElement(IconComponent, {
      ref,
      className,
      size,
      strokeWidth,
      ...props
    });
  });
};

export const IconActivity = createIcon(Activity);
export const IconCheck = createIcon(Check);
export const IconAlertCircle = createIcon(AlertCircle);
export const IconX = createIcon(X);
export const IconChevronLeft = createIcon(ChevronLeft);
export const IconChevronRight = createIcon(ChevronRight);
export const IconChevronsLeft = createIcon(ChevronsLeft);
export const IconChevronsRight = createIcon(ChevronsRight);
export const IconUser = createIcon(User);
export const IconCalendar = createIcon(Calendar);
export const IconSearch = createIcon(Search);
export const IconEye = createIcon(Eye);
export const IconEyeOff = createIcon(EyeOff);
export const IconLock = createIcon(Lock);
export const IconMail = createIcon(Mail);
export const IconPlus = createIcon(Plus);
export const IconTrash = createIcon(Trash);
export const IconLoader = createIcon(Loader2);
export const IconInfo = createIcon(Info);
export const IconAlertTriangle = createIcon(AlertTriangle);
export const IconTrendingUp = createIcon(TrendingUp);
export const IconTrendingDown = createIcon(TrendingDown);
export const IconArrowUpRight = createIcon(ArrowUpRight);
export const IconArrowDownRight = createIcon(ArrowDownRight);
export const IconSparkles = createIcon(Sparkles);
export const IconClock = createIcon(Clock);
export const IconArrowLeft = createIcon(ArrowLeft);
export const IconArrowRight = createIcon(ArrowRight);
export const IconMenu = createIcon(Menu);
export const IconSettings = createIcon(Settings);
export const IconHome = createIcon(Home);
export const IconClipboard = createIcon(Clipboard);
export const IconShieldAlert = createIcon(ShieldAlert);
export const IconHelp = createIcon(HelpCircle);
export const IconUpload = createIcon(Upload);
export const IconUserCheck = createIcon(UserCheck);
export const IconBuilding = createIcon(Building);
export const IconHeartPulse = createIcon(HeartPulse);
