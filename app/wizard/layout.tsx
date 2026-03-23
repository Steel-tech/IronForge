"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadUserState } from "@/lib/store/user-profile";
import type { UserState } from "@/lib/types/wizard";
import { DEFAULT_STATE } from "@/lib/types/wizard";

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
      <div className="min-h-screen flex items-center justify-center bg-cyber-black">
        <div className="text-center space-y-3">
          <div className="text-neon-cyan font-mono text-sm animate-neon-pulse text-glow-cyan">
            INITIALIZING FORGE...
          </div>
          <div className="flex gap-1.5 justify-center">
            <span className="streaming-dot w-2 h-2 bg-neon-cyan rounded-full inline-block" />
            <span className="streaming-dot w-2 h-2 bg-neon-cyan rounded-full inline-block" />
            <span className="streaming-dot w-2 h-2 bg-neon-cyan rounded-full inline-block" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
