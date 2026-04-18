"use client"

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import { clearToken, getToken, setToken } from "@/lib/api/client"
import { getMe, login as apiLogin } from "@/lib/api/endpoints/auth"
import type { User, UserRole } from "@/lib/api/types"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthState {
  user: User | null
  token: string | null
  status: AuthStatus
  error: string | null
}

type AuthAction =
  | { type: "LOGIN_SUCCESS"; user: User; token: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; error: string }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, status: "loading", error: null }
    case "LOGIN_SUCCESS":
      return {
        user: action.user,
        token: action.token,
        status: "authenticated",
        error: null,
      }
    case "LOGOUT":
      return { user: null, token: null, status: "unauthenticated", error: null }
    case "SET_ERROR":
      return {
        user: null,
        token: null,
        status: "unauthenticated",
        error: action.error,
      }
  }
}

export interface AuthContextValue {
  user: User | null
  status: AuthStatus
  error: string | null
  isAdmin: boolean
  isSuperAdmin: boolean
  login: (lawexaToken: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    status: "loading",
    error: null,
  })

  useEffect(() => {
    const token = getToken()
    if (!token) {
      dispatch({ type: "LOGOUT" })
      return
    }

    getMe()
      .then((user) => dispatch({ type: "LOGIN_SUCCESS", user, token }))
      .catch(() => {
        clearToken()
        dispatch({ type: "LOGOUT" })
      })
  }, [])

  const login = useCallback(async (lawexaToken: string) => {
    dispatch({ type: "SET_LOADING" })
    try {
      const response = await apiLogin(lawexaToken)
      setToken(response.access_token)
      dispatch({
        type: "LOGIN_SUCCESS",
        user: response.user,
        token: response.access_token,
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again."
      dispatch({ type: "SET_ERROR", error: message })
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    clearToken()
    dispatch({ type: "LOGOUT" })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      status: state.status,
      error: state.error,
      isAdmin: state.user ? ADMIN_ROLES.includes(state.user.role) : false,
      isSuperAdmin: state.user?.role === "super_admin",
      login,
      logout,
    }),
    [state.user, state.status, state.error, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
