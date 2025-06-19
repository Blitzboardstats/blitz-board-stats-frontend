
import { useState, useEffect } from 'react';

export const useStatisticianAcknowledgment = () => {
  const [hasAcceptedStatisticianTerms, setHasAcceptedStatisticianTerms] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already accepted statistician terms
    const checkStatisticianTermsAcceptance = () => {
      try {
        const accepted = localStorage.getItem('blitz-statistician-terms-accepted');
        setHasAcceptedStatisticianTerms(!!accepted);
      } catch (error) {
        console.error('Error checking statistician terms acceptance:', error);
        setHasAcceptedStatisticianTerms(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatisticianTermsAcceptance();
  }, []);

  const acceptStatisticianTerms = () => {
    try {
      localStorage.setItem('blitz-statistician-terms-accepted', new Date().toISOString());
      setHasAcceptedStatisticianTerms(true);
    } catch (error) {
      console.error('Error accepting statistician terms:', error);
    }
  };

  const resetStatisticianTermsAcceptance = () => {
    try {
      localStorage.removeItem('blitz-statistician-terms-accepted');
      setHasAcceptedStatisticianTerms(false);
    } catch (error) {
      console.error('Error resetting statistician terms acceptance:', error);
    }
  };

  return {
    hasAcceptedStatisticianTerms,
    isLoading,
    acceptStatisticianTerms,
    resetStatisticianTermsAcceptance,
  };
};
