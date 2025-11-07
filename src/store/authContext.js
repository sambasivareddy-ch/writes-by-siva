// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

const SESSION_KEY = "app_session_user";

const AuthContext = createContext({
    authUser: null,
    loading: true,
    signIn: async (provider) => {},
    signOutLocal: async () => {},
    getIdToken: async () => string,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authUser, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (fbUser) => {
            if (fbUser) {
                const s = {
                    uid: fbUser.uid,
                    displayName: fbUser.displayName,
                    email: fbUser.email,
                };
                setUser(s);
                try {
                    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
                } catch {}
            } else {
                setUser(null);
                try {
                    localStorage.removeItem(SESSION_KEY);
                } catch {}
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const signIn = async (provider) => {
        const prov =
            provider === "google"
                ? new GoogleAuthProvider()
                : new GithubAuthProvider();
        await signInWithPopup(auth, prov);
        // onAuthStateChanged will persist the session into localStorage
    };

    const signOutLocal = async () => {
        // optional: sign out from firebase or just clear local session
        try {
            await signOut(auth);
        } catch {
            /* silent */
        }
        setUser(null);
        try {
            localStorage.removeItem(SESSION_KEY);
        } catch {}
    };

    const getIdToken = async () => {
        if (!auth.currentUser) return null;
        return auth.currentUser.getIdToken(/* forceRefresh */ false);
    };

    return (
        <AuthContext.Provider
            value={{ authUser, loading, signIn, signOutLocal, getIdToken }}
        >
            {children}
        </AuthContext.Provider>
    );
};
