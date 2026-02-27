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
  const [userState, setUserState] = useState<UserState>(DEFAULT_STATE);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-iron-400">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
