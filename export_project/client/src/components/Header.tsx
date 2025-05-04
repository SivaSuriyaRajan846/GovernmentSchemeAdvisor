import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  const [language, setLanguage] = useState("english");
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <Link href="/">
          <div className="flex items-center mb-3 md:mb-0 cursor-pointer">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Government of India Emblem" 
              className="h-12 mr-3"
            />
            <div>
              <h1 className="font-bold text-xl text-neutral-800">Government Scheme Recommender</h1>
              <p className="text-sm text-neutral-600">Find eligible schemes just for you</p>
            </div>
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="default" 
            className="hidden md:flex bg-accent hover:bg-accent-dark"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            How It Works
          </Button>
          
          <div className="flex items-center">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[140px] bg-transparent border-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
