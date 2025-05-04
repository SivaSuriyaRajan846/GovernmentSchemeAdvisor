import { Button } from "@/components/ui/button";

interface NoResultsProps {
  onModifyProfile: () => void;
}

export function NoResults({ onModifyProfile }: NoResultsProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" alt="No results" className="w-24 h-24 mx-auto mb-4 opacity-60" />
      <h3 className="font-medium text-xl text-neutral-700 mb-2">No matching schemes found</h3>
      <p className="text-neutral-600 mb-4">Try adjusting your profile details to discover more schemes you might be eligible for.</p>
      <Button 
        className="bg-primary hover:bg-primary-dark text-white font-medium"
        onClick={onModifyProfile}
      >
        Modify Your Profile
      </Button>
    </div>
  );
}
