import { useState, useEffect } from 'react';

export default function useAddressValidation(address: string) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAddress = async () => {
      if (address.length < 5) {
        setIsValid(null);
        setError(null);
        return;
      }

      setIsValidating(true);
      setError(null);

      try {
        const response = await fetch('/api/validateAddress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });

        if (!response.ok) {
          throw new Error('Failed to validate address');
        }

        const data = await response.json();
        setIsValid(data.isValid);
      } catch (err) {
        setError('Error validating address');
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateAddress, 500);

    return () => clearTimeout(timeoutId);
  }, [address]);

  return { isValid, isValidating, error };
}