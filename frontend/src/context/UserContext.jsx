import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { DEMO_ACCOUNTS } from "../data/demoAccounts";

const UserContext = createContext(null);

const STORAGE_KEY = "hirepulse_user";
const DEMO_FLAG_KEY = "hirepulse_is_demo";

const readStoredUser = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    // Refresh renamed demo accounts so stale sessions pick up new names
    if (parsed?.demo) {
      const fresh = DEMO_ACCOUNTS.find(
        (acc) => acc.email === parsed.email || acc.id === parsed._id
      );
      if (fresh) {
        const { password: _pw, ...safeProfile } = fresh;
        return { ...parsed, _id: fresh.id, name: fresh.name, email: fresh.email, profile: safeProfile };
      }
    }
    return parsed;
  } catch {
    return null;
  }
};

const readStoredDemoFlag = () => {
  try {
    return localStorage.getItem(DEMO_FLAG_KEY) === "true";
  } catch {
    return false;
  }
};

export function UserProvider({ children }) {
  const [user, setUserState] = useState(readStoredUser);
  const [isDemo, setIsDemo] = useState(readStoredDemoFlag);

  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const clearUser = () => {
    setUserState(null);
    setIsDemo(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DEMO_FLAG_KEY);
  };

  /**    * login(email, password) flow:
   * 1. Demo accounts resolve instantly from frontend state (no MongoDB,
   *    no network). Their full mock profile rides along.
   * 2. Anything else goes to the real backend (JWT httpOnly cookie) and
   *    MongoDB-persisted accounts.
   * Returns { success, isDemoAccount, error? }.
   */
  const login = async (email, password) => {
    const normalized = String(email || "").trim().toLowerCase();
    const demoAccount = DEMO_ACCOUNTS.find(
      (acc) => acc.email === normalized && acc.password === password
    );

    if (demoAccount) {
      const { password: _pw, ...safeProfile } = demoAccount;
      const sessionUser = {
        _id: demoAccount.id,
        name: demoAccount.name,
        email: demoAccount.email,
        userType: "student",
        demo: true,
        profile: safeProfile,
      };
      setUser(sessionUser);
      setIsDemo(true);
      localStorage.setItem(DEMO_FLAG_KEY, "true");

      // Also authenticate against the backend (best-effort) so the JWT
      // httpOnly cookie is set — protected AI routes (resume analysis,
      // job recommendations, interview chat) require it. Demo login itself
      // still works with zero network.
      axios
        .post(`${import.meta.env.VITE_API_URL_NODE}/api/users/auth`, {
          email: normalized,
          password,
        })
        .catch(() => {
          /* backend down — demo session still valid, AI routes will 401 */
        });

      return { success: true, isDemoAccount: true };
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_NODE}/api/users/auth`,
        { email: normalized, password }
      );

      const data = response.data || {};
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        userType: data.userType || "student",
        profile: data.profileData || null,
      });
      setIsDemo(false);
      return { success: true, isDemoAccount: false };
    } catch (err) {
      const apiMessage =
        err?.response?.status === 503
          ? "Database unavailable right now. Try a demo account instead."
          : null;
      return { success: false, error: apiMessage || "Invalid email or password" };
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isDemo, login }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
