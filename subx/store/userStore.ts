import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  fullName: string;
  email: string;
  phoneNumber: string;
  incomeRange: string;
  referralCode?: string;
  dateJoined: string;
};

type UserStore = {
  users: User[];
  signupCount: number;
  currentUser: User | null;
  addUser: (user: Omit<User, 'dateJoined' | 'referralCode'>) => void;
  generateReferralCode: (email: string) => string;
  getUserByReferralCode: (code: string) => User | undefined;
  reset: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      signupCount: 137582, // Starting with a mock count
      currentUser: null,
      
      addUser: (userData) => {
        const referralCode = get().generateReferralCode(userData.email);
        const newUser: User = {
          ...userData,
          referralCode,
          dateJoined: new Date().toISOString(),
        };
        
        set((state) => ({
          users: [...state.users, newUser],
          signupCount: state.signupCount + 1,
          currentUser: newUser,
        }));
        
        return newUser;
      },
      
      generateReferralCode: (email) => {
        // Generate a simple referral code based on email and timestamp
        const baseString = email + new Date().getTime();
        return 'SUBX' + 
          baseString
            .split('')
            .map(char => char.charCodeAt(0))
            .reduce((a, b) => a + b, 0)
            .toString(36)
            .toUpperCase()
            .substring(0, 6);
      },
      
      getUserByReferralCode: (code) => {
        return get().users.find(user => user.referralCode === code);
      },
      
      reset: () => {
        set({ users: [], currentUser: null });
      },
    }),
    {
      name: 'subx-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);