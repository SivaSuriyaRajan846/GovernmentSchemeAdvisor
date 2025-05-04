import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SchemeCard } from "./SchemeCard";
import { NoResults } from "./NoResults";
import { SCHEME_CATEGORIES } from "@/lib/utils";
import { Download, Printer } from "lucide-react";
import type { Scheme } from "@shared/schema";

interface SchemeResultsProps {
  schemes: Scheme[];
  loading: boolean;
  onModifyProfile: () => void;
}

export function SchemeResults({ schemes, loading, onModifyProfile }: SchemeResultsProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const filteredSchemes = categoryFilter === "all"
    ? schemes
    : schemes.filter(scheme => scheme.category === categoryFilter);
  
  const handleExportResults = () => {
    // In a real app, this would generate a PDF or other export format
    alert("This would export the results in a real application.");
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="lg:col-span-8 flex flex-col space-y-6">
      {/* Results Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="font-semibold text-xl text-neutral-800">Recommended Schemes</h2>
          
          <div className="flex items-center mt-3 sm:mt-0">
            <span className="text-sm text-neutral-600 mr-3">Filter by:</span>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white border border-neutral-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHEME_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-neutral-100 rounded-md">
          <div>
            <p className="text-neutral-700 font-medium">
              Based on your profile, you may be eligible for <span className="text-primary font-bold">{schemes.length} schemes</span>
            </p>
            <p className="text-sm text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="mt-3 md:mt-0 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              onClick={handleExportResults}
            >
              <Download className="h-4 w-4 mr-1" /> Export Results
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
          </div>
        </div>
      </div>
      
      {/* Schemes Grid */}
      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      ) : (
        <NoResults onModifyProfile={onModifyProfile} />
      )}
    </section>
  );
}
