import { useState } from "react";
import { Header } from "@/components/Header";
import { InfoPanel } from "@/components/InfoPanel";
import { UserProfileForm } from "@/components/UserProfileForm";
import { SchemeResults } from "@/components/SchemeResults";
import { Footer } from "@/components/Footer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ProfileFormValues, Scheme } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [userProfile, setUserProfile] = useState<ProfileFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Query for schemes based on user profile
  const { 
    data: schemes, 
    isLoading, 
    refetch 
  } = useQuery<Scheme[]>({
    queryKey: ['/api/schemes'],
    enabled: !!userProfile, // Only run query if there's a user profile
    queryFn: async () => {
      if (!userProfile) return [];
      setIsSubmitting(true);
      try {
        const res = await apiRequest('POST', '/api/schemes/recommend', userProfile);
        const data = await res.json();
        return data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch schemes. Please try again.",
          variant: "destructive",
        });
        return [];
      } finally {
        setIsSubmitting(false);
      }
    }
  });
  
  const handleFormSubmit = async (data: ProfileFormValues) => {
    setUserProfile(data);
    await refetch();
  };
  
  const handleModifyProfile = () => {
    // This would scroll back to the form section
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <InfoPanel />
          
          <UserProfileForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={isSubmitting}
          />
          
          {userProfile && (
            <SchemeResults 
              schemes={schemes || []} 
              loading={isLoading || isSubmitting}
              onModifyProfile={handleModifyProfile}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
