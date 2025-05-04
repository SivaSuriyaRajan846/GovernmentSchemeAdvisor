import { Button } from "@/components/ui/button";
import { getMatchLevelColor, getCategoryColor, MatchLevel } from "@/lib/utils";
import { Bookmark, Download, FileText } from "lucide-react";
import { Link } from "wouter";
import type { Scheme } from "@shared/schema";

interface SchemeCardProps {
  scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const matchLevel: MatchLevel = scheme.eligibilityCriteria.matchLevel as MatchLevel || "medium";
  
  const handleDownloadForm = async () => {
    try {
      const response = await fetch(`/api/schemes/${scheme.id}/form`);
      if (!response.ok) throw new Error('Failed to download form');
      
      // Get filename from Content-Disposition header or use a default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `${scheme.name.replace(/\s+/g, '_')}_application_form.pdf`;
      
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
      alert('Failed to download the application form. Please try again later.');
    }
  };
  
  const handleSaveScheme = () => {
    // In a real app, this would save the scheme to the user's saved schemes
    alert("This would save the scheme in a real application.");
  };
  
  return (
    <div className="scheme-card bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5 border-b border-neutral-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-1">
              <span className={`text-xs px-2 py-1 rounded mr-2 ${getMatchLevelColor(matchLevel)}`}>
                {matchLevel === "high" ? "High Match" : matchLevel === "medium" ? "Medium Match" : "Low Match"}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(scheme.category)}`}>
                {scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}
              </span>
            </div>
            <h3 className="font-medium text-lg text-neutral-800">{scheme.name}</h3>
          </div>
          <button 
            className="text-neutral-500 hover:text-neutral-700"
            onClick={handleSaveScheme}
          >
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-neutral-600 my-2">{scheme.description}</p>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {scheme.eligibilityCriteria.reasons?.map((reason: string, index: number) => (
            <span key={index} className="inline-flex items-center text-xs bg-accent bg-opacity-10 text-accent px-2 py-1 rounded-full">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4 12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {reason}
            </span>
          ))}
          
          {scheme.eligibilityCriteria.warnings?.map((warning: string, index: number) => (
            <span key={index} className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {warning}
            </span>
          ))}
        </div>
      </div>
      
      <div className="px-5 py-3 bg-neutral-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center mb-3 sm:mb-0">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="Ministry logo" 
            className="h-6 mr-2"
          />
          <span className="text-xs text-neutral-600">{scheme.ministry}</span>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/scheme/${scheme.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <FileText className="h-4 w-4 mr-1" /> View Details
            </Button>
          </Link>
          <Button
            variant="default"
            size="sm"
            className="bg-secondary text-white hover:bg-secondary-dark"
            onClick={handleDownloadForm}
          >
            <Download className="h-4 w-4 mr-1" /> Application Form
          </Button>
        </div>
      </div>
    </div>
  );
}
