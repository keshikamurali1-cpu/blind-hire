import React from 'react';
import { 
  Home, 
  ClipboardList, 
  Users, 
  FlaskConical, 
  CheckCircle2, 
  Settings, 
  ShieldCheck,
  Sparkles,
  LogOut,
  User,
  X,
  Lock,
  Award
} from 'lucide-react';
import { UserSession } from '../types';

export type MainNavTab = 'home' | 'evaluations' | 'candidates' | 'assessments' | 'evidence' | 'settings' | 'privacy';

interface SidebarProps {
  activeTab: MainNavTab | 'workflow';
  onSelectTab: (tab: MainNavTab) => void;
  onExploreSample: () => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  isSampleActive?: boolean;
  currentUser?: UserSession | null;
  onSignOut?: () => void;
  onOpenSkillPassport?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onExploreSample,
  isOpenMobile,
  onToggleMobile,
  isSampleActive = true,
  currentUser,
  onSignOut,
  onOpenSkillPassport,
}) => {
  const navItems: { id: MainNavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'evaluations', label: 'Evaluations', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'candidates', label: 'Candidates', icon: <Users className="w-4 h-4" /> },
    { id: 'assessments', label: 'Assessments', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'evidence', label: 'Evidence', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy Center', icon: <Lock className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const content = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200/80">
          <button 
            onClick={() => onSelectTab('home')} 
            className="flex items-center space-x-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base block leading-none">
                BlindHire
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                Evidence-Based
              </span>
            </div>
          </button>

          {/* Close button on mobile */}
          <button
            onClick={onToggleMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (isOpenMobile) onToggleMobile();
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Skill Passport shortcut if available */}
          {onOpenSkillPassport && (
            <button
              onClick={() => {
                onOpenSkillPassport();
                if (isOpenMobile) onToggleMobile();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Skill Passport</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom utility & User Profile Section */}
      <div className="p-3 border-t border-slate-200/80 space-y-3">
        {/* Sample Shortcut */}
        <div className="bg-indigo-50/60 border border-indigo-100/80 rounded-xl p-2.5">
          <div className="flex items-center space-x-1.5 text-indigo-900 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Hackathon Demo</span>
          </div>
          <button
            onClick={() => {
              onExploreSample();
              if (isOpenMobile) onToggleMobile();
            }}
            className="w-full py-1.5 px-2 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer text-center block"
          >
            Explore Sample Evaluation
          </button>
        </div>

        {/* User Account / Profile At Bottom */}
        {currentUser ? (
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between px-1">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 truncate">
                <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                  {currentUser.name || 'User'}
                </span>
                <span className="text-[10px] text-slate-500 capitalize block truncate">
                  {currentUser.role}
                </span>
              </div>
            </div>

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition shrink-0 cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 px-1 text-center">
            Demographic signals masked
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (fixed left) */}
      <aside className="hidden md:flex flex-col w-56 border-r border-slate-200 bg-white min-h-screen shrink-0 sticky top-0 h-screen overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
            onClick={onToggleMobile} 
          />
          <div className="relative flex flex-col w-64 max-w-xs bg-white h-full shadow-xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
