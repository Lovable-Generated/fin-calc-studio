import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in localStorage (mock database)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser && existingUser.password === password) {
      const userData = {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        createdAt: existingUser.createdAt
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userData.firstName} ${userData.lastName}`,
      });
      
      navigate('/dashboard');
    } else if (existingUser) {
      toast({
        title: "Invalid credentials",
        description: "Incorrect password. Please try again.",
        variant: "destructive"
      });
      throw new Error('Invalid password');
    } else {
      // For demo purposes, create a guest account
      const guestUser = {
        id: `guest_${Date.now()}`,
        email: email,
        firstName: 'Guest',
        lastName: 'User',
        createdAt: new Date().toISOString()
      };
      
      setUser(guestUser);
      localStorage.setItem('user', JSON.stringify(guestUser));
      
      toast({
        title: "Welcome!",
        description: "Logged in as guest user for demo purposes",
      });
      
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      toast({
        title: "Account already exists",
        description: "An account with this email already exists. Please sign in.",
        variant: "destructive"
      });
      setIsLoading(false);
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In real app, this would be hashed
      firstName,
      lastName,
      createdAt: new Date().toISOString()
    };
    
    // Save to mock database
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set current user (without password)
    const userData = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      createdAt: newUser.createdAt
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    toast({
      title: "Account created!",
      description: "Welcome to FinCalc Studio. Your account has been created successfully.",
    });
    
    navigate('/dashboard');
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};