import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Save, Calendar, Award, Landmark, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatIndianRupee, getCategoryColor } from "@/lib/utils";
import type { Scheme } from "@shared/schema";

export default function SchemeDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const numericId = parseInt(id, 10);
  
  const { data: scheme, isLoading, error } = useQuery<Scheme>({
    queryKey: [`/api/schemes/${id}`],
    staleTime: 60000, // 1 minute
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load scheme details. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const handleDownloadForm = async () => {
    try {
      const response = await fetch(`/api/schemes/${id}/form`);
      if (!response.ok) throw new Error('Failed to download form');
      
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `application_form.pdf`;
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading form:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the application form. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-grow flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!scheme) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-grow">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Scheme Not Found</h2>
                <p className="text-gray-600 mb-4">The scheme you're looking for doesn't exist or has been removed.</p>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary-dark">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="pl-0 text-neutral-600 hover:text-neutral-900">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Schemes
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded mr-2 ${getCategoryColor(scheme.category)}`}>
                        {scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}
                      </span>
                      <span className="text-sm text-neutral-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> Updated: {new Date(scheme.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-bold">{scheme.name}</CardTitle>
                  </div>
                  <Button variant="outline" className="rounded-full h-8 w-8 p-0">
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center mb-4 bg-neutral-50 p-3 rounded-md">
                  <Landmark className="h-5 w-5 text-primary mr-2" />
                  <p className="text-sm font-medium">{scheme.ministry}</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About the Scheme</h3>
                    <p className="text-neutral-700">{scheme.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                    <p className="text-neutral-700">{scheme.benefits}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Eligibility Criteria</h3>
                    <ul className="space-y-2">
                      {scheme.eligibilityCriteria.criteria?.map((criterion: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                          <span>{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Required Documents</h3>
                    <ul className="space-y-2">
                      {scheme.eligibilityCriteria.documents?.map((document: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                          <span>{document}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Important Notes</h3>
                    <ul className="space-y-2">
                      {scheme.eligibilityCriteria.notes?.map((note: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary-dark"
                    onClick={handleDownloadForm}
                  >
                    <Download className="h-4 w-4 mr-2" /> Download Application Form
                  </Button>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">How to Apply</h4>
                    <ol className="list-decimal ml-5 space-y-2 text-sm">
                      <li>Download the application form by clicking the button above.</li>
                      <li>Fill out all required fields in the application form.</li>
                      <li>Attach all required documents.</li>
                      <li>Submit the application to your nearest concerned office or online portal.</li>
                    </ol>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Helpline</h4>
                    <p className="text-sm">For any queries related to this scheme, contact:</p>
                    <p className="text-sm font-semibold mt-1">1800-XXX-XXXX</p>
                    <p className="text-sm">(Toll-free, available Monday to Friday, 9 AM to 6 PM)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
