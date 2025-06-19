
import { useState, useEffect } from 'react';

export const useTermsAcceptance = () => {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already accepted terms
    const checkTermsAcceptance = () => {
      try {
        const accepted = localStorage.getItem('blitz-terms-accepted');
        setHasAcceptedTerms(!!accepted);
      } catch (error) {
        console.error('Error checking terms acceptance:', error);
        setHasAcceptedTerms(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTermsAcceptance();
  }, []);

  const acceptTerms = () => {
    try {
      localStorage.setItem('blitz-terms-accepted', new Date().toISOString());
      setHasAcceptedTerms(true);
    } catch (error) {
      console.error('Error accepting terms:', error);
    }
  };

  const resetTermsAcceptance = () => {
    try {
      localStorage.removeItem('blitz-terms-accepted');
      setHasAcceptedTerms(false);
    } catch (error) {
      console.error('Error resetting terms acceptance:', error);
    }
  };

  return {
    hasAcceptedTerms,
    isLoading,
    acceptTerms,
    resetTermsAcceptance,
  };
};
