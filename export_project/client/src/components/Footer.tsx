import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Phone, Mail, MapPin, Facebook, Globe, AtSign } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export function Footer() {
  const [email, setEmail] = useState("");
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would subscribe the user to updates
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  };
  
  return (
    <footer className="bg-neutral-800 text-neutral-300 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="Government of India Emblem" 
                className="h-10 mr-3 brightness-200"
              />
              <h3 className="font-semibold text-white">Government Scheme Recommender</h3>
            </div>
            <p className="text-sm mb-4">A platform to help citizens find and access government welfare schemes they are eligible for.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <AtSign className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><a href="#" className="hover:text-white">About This Portal</a></li>
              <li><a href="#" className="hover:text-white">All Schemes</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>Helpline: 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@schemerecommender.gov.in</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Ministry of Electronics & IT, New Delhi</span>
              </li>
            </ul>
            
            <div className="mt-4 p-3 bg-neutral-700 rounded-md">
              <h5 className="text-white text-sm font-medium mb-2">Subscribe for Updates</h5>
              <form onSubmit={handleSubscribe} className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-neutral-600 text-white text-sm rounded-l-md border-none focus:outline-none focus:ring-1 focus:ring-primary" 
                />
                <Button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 rounded-r-md rounded-l-none">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-700 text-sm text-center">
          <p>© {new Date().getFullYear()} Government Scheme Recommender Portal. All Rights Reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
