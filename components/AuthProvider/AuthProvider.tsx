"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const [loading, setLoading] = useState(true);

  const isPrivateRoute = useMemo(
    () => pathname.startsWith("/profile") || pathname.startsWith("/notes"),
    [pathname],
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      try {
        const user = await checkSession();
        if (!alive) return;

        if (user) {
          setUser(user);
          setLoading(false);
          return;
        }

        clearIsAuthenticated();

        if (isPrivateRoute) {
          try {
            await logout();
          } catch {}
          router.replace("/sign-in");
        }

        setLoading(false);
      } catch {
        if (!alive) return;

        clearIsAuthenticated();

        if (isPrivateRoute) {
          try {
            await logout();
          } catch {}
          router.replace("/sign-in");
        }

        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isPrivateRoute, pathname, router, setUser, clearIsAuthenticated]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (isPrivateRoute && !isAuthenticated) return null;

  return <>{children}</>;
}
