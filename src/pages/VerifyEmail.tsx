import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createUserDocument, addToWaitlist } from '@/lib/db';
import Logo from '@/components/Logo';
import { analyticsEvents } from '@/lib/firebase';

interface LocationState {
  firstName?: string;
  lastName?: string;
}

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const { currentUser, sendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName, lastName } = (location.state as LocationState) || {};

  useEffect(() => {
    analyticsEvents.pageView('verify_email_page');
  }, []);

  useEffect(() => {
    const checkVerification = async () => {
      if (currentUser?.emailVerified) {
        try {
          await createUserDocument(currentUser.uid, currentUser.email, firstName || '', lastName || '');
          await addToWaitlist(currentUser.uid, currentUser.email);
          analyticsEvents.emailVerified();
          navigate('/dashboard');
        } catch (error: any) {
          console.error('Error completing registration:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to complete registration. Please try again.",
          });
        }
      }
    };

    const interval = setInterval(() => {
      if (currentUser) {
        currentUser.reload().then(checkVerification);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUser, navigate, toast, firstName, lastName]);

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      await sendVerificationEmail();
      analyticsEvents.emailVerificationSent();
      toast({
        title: "Verification email sent!",
        description: "Please check your inbox.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send verification email.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/signup');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        <Logo className="inline-block mb-6" />
        <h2 className="text-3xl font-bold text-white mb-6">Verify Your Email</h2>
        <p className="text-gray-300 mb-6">
          We've sent a verification email to {currentUser.email}.<br />
          Please verify your email to continue.
        </p>
        <Button
          onClick={handleResendEmail}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Resend Verification Email'}
        </Button>
      </div>
    </div>
  );
}