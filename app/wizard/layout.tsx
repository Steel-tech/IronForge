"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadUserState } from "@/lib/store/user-profile";
import type { UserState } from "@/lib/types/wizard";
import { DEFAULT_STATE } from "@/lib/types/wizard";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { StepContentSkeleton, ChatPanelSkeleton } from "@/components/ui/skeleton";

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [, setUserState] = useState<UserState>(DEFAULT_STATE);

  useEffect(() => {
    const state = loadUserState();
    if (!state.profile.state) {
      router.push("/");
      return;
    }
    setUserState(state);
    setLoaded(true);
  }, [router]);

  if (!loaded) {
    return (
      <div className="h-screen flex bg-cyber-black tron-grid">
        {/* Skeleton sidebar placeholder */}
        <div className="hidden lg:flex w-72 bg-cyber-darker border-r border-cyber-border flex-col p-4 gap-3">
          <div className="h-8 rounded skeleton-shimmer" />
          <div className="h-4 rounded skeleton-shimmer w-2/3" />
          <div className="mt-4 space-y-2">
            <div className="h-10 rounded skeleton-shimmer" />
            <div className="h-10 rounded skeleton-shimmer" />
            <div className="h-10 rounded skeleton-shimmer" />
            <div className="h-10 rounded skeleton-shimmer" />
          </div>
          <div className="mt-auto text-center text-neon-cyan font-mono text-[10px] uppercase tracking-widest animate-neon-pulse">
            Initializing forge…
          </div>
        </div>

        <StepContentSkeleton />

        <ChatPanelSkeleton />
      </div>
    );
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
