import { toast } from '@/components/ui/use-toast';

export const useToast = () => {
  const showToast = (title: string, description?: string, variant: 'default' | 'destructive' = 'default') => {
    toast({
      title,
      description,
      variant,
    });
  };

  return { showToast };
};