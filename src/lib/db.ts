import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  uid: string;
  createdAt: any;
  updatedAt: any;
  emailVerified: boolean;
}

export async function createUserDocument(
  userId: string, 
  email: string | null, 
  firstName: string,
  lastName: string
) {
  if (!userId || !email) {
    throw new Error('User ID and email are required');
  }

  try {
    const userData: UserData = {
      email,
      firstName,
      lastName,
      uid: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emailVerified: false
    };

    await setDoc(doc(db, 'users', userId), userData);
    return true;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export async function addToWaitlist(userId: string, email: string | null) {
  if (!userId || !email) {
    throw new Error('User ID and email are required');
  }

  try {
    const waitlistData = {
      email,
      uid: userId,
      verifiedAt: serverTimestamp(),
      status: 'verified'
    };

    await setDoc(doc(db, 'waitinglist', userId), waitlistData);
    return true;
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    throw error;
  }
}