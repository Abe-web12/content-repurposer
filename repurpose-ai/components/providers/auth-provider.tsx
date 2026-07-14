
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase/types";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());
  const mounted = useRef(true);

  const fetchProfile = useCallback(
    async (userId: string, userEmail?: string, userMeta?: any): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // If profile doesn't exist (trigger didn't fire), create it
      if (error && error.code === "PGRST116") {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: userEmail || "",
            full_name: userMeta?.full_name || userMeta?.name || "",
            avatar_url: userMeta?.avatar_url || userMeta?.picture || "",
          })
          .select("*")
          .single();

        if (insertError) {
          console.error("Failed to create profile:", insertError.message);
          return null;
        }

        return newProfile as Profile;
      }

      if (error) {
        console.error("Failed to load profile:", error.message);
        return null;
      }

      return data as Profile;
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const data = await fetchProfile(user.id);
    if (data) setProfile(data);
  }, [user, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    // Full reload to clear all client state
    window.location.assign("/login");
  }, [supabase]);

  useEffect(() => {
    mounted.current = true;

    async function initialize() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!mounted.current) return;
      setUser(currentUser);

      if (currentUser) {
        const nextProfile = await fetchProfile(
          currentUser.id,
          currentUser.email,
          currentUser.user_metadata
        );
        if (mounted.current) setProfile(nextProfile);
      }

      if (mounted.current) setLoading(false);
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        if (!mounted.current) return;
        setUser(currentUser ?? null);

        if (currentUser) {
          const nextProfile = await fetchProfile(
            currentUser.id,
            currentUser.email,
            currentUser.user_metadata
          );
          if (mounted.current) {
            setProfile(nextProfile);
            setLoading(false);
          }
        }
      } else if (event === "SIGNED_OUT") {
        if (mounted.current) {
          setUser(null);
          setProfile(null);
        }
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, refreshProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
