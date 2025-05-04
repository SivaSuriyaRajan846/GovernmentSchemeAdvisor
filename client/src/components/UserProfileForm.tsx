import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { profileFormSchema, type ProfileFormValues } from "@shared/schema";
import { STATES, DISTRICTS } from "@/lib/utils";
import { Search } from "lucide-react";
import { FormField as CustomFormField } from "@/components/ui/form-field";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserProfileFormProps {
  onSubmit: (data: ProfileFormValues) => void;
  isSubmitting: boolean;
}

export function UserProfileForm({ onSubmit, isSubmitting }: UserProfileFormProps) {
  const [availableDistricts, setAvailableDistricts] = useState<{ value: string; label: string }[]>([]);
  const { toast } = useToast();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      age: undefined,
      gender: undefined,
      socialCategory: undefined,
      annualIncome: undefined,
      occupation: undefined,
      state: undefined,
      district: "",
      residence: undefined,
      bplCard: false,
      mgnregaCard: false,
      kisanCreditCard: false,
      disabilityCertificate: false,
    },
  });

  // Watch state to update districts
  const watchState = form.watch("state");

  useEffect(() => {
    if (watchState && DISTRICTS[watchState as keyof typeof DISTRICTS]) {
      setAvailableDistricts(DISTRICTS[watchState as keyof typeof DISTRICTS]);
    } else {
      setAvailableDistricts([]);
    }
  }, [watchState]);

  const handleFormSubmit = async (data: ProfileFormValues) => {
    try {
      onSubmit(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-semibold text-xl mb-4 text-neutral-800 border-b pb-2">Your Profile</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          {/* Personal Details Section */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3 text-neutral-700">Personal Details</h3>
            
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <CustomFormField label="Full Name">
                  <Input 
                    placeholder="Your full name" 
                    {...field} 
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                  />
                </CustomFormField>
              )}
            />
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <CustomFormField label="Age">
                  <Input 
                    type="number" 
                    placeholder="Your age" 
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : Number(e.target.value);
                      field.onChange(value);
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                  />
                </CustomFormField>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <CustomFormField label="Gender">
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <label htmlFor="male" className="text-sm text-neutral-700">Male</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <label htmlFor="female" className="text-sm text-neutral-700">Female</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <label htmlFor="other" className="text-sm text-neutral-700">Other</label>
                    </div>
                  </RadioGroup>
                </CustomFormField>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialCategory"
              render={({ field }) => (
                <CustomFormField label="Social Category">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="obc">OBC</SelectItem>
                      <SelectItem value="sc">SC</SelectItem>
                      <SelectItem value="st">ST</SelectItem>
                      <SelectItem value="ews">EWS</SelectItem>
                    </SelectContent>
                  </Select>
                </CustomFormField>
              )}
            />
          </div>
          
          {/* Financial Details Section */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3 text-neutral-700">Financial Details</h3>
            
            <FormField
              control={form.control}
              name="annualIncome"
              render={({ field }) => (
                <CustomFormField label="Annual Income (₹)">
                  <Input 
                    type="number" 
                    placeholder="Annual income in rupees" 
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : Number(e.target.value);
                      field.onChange(value);
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                  />
                </CustomFormField>
              )}
            />
            
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <CustomFormField label="Occupation">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <SelectValue placeholder="Select occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                      <SelectItem value="salaried">Salaried Employee</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="homemaker">Homemaker</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </CustomFormField>
              )}
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Do you have any of these?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="bplCard"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bplCard"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="bplCard"
                        className="text-sm text-neutral-700"
                      >
                        BPL Card
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mgnregaCard"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mgnregaCard"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="mgnregaCard"
                        className="text-sm text-neutral-700"
                      >
                        MGNREGA Card
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="kisanCreditCard"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="kisanCreditCard"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="kisanCreditCard"
                        className="text-sm text-neutral-700"
                      >
                        Kisan Credit Card
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="disabilityCertificate"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="disabilityCertificate"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="disabilityCertificate"
                        className="text-sm text-neutral-700"
                      >
                        Disability Certificate
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* Location Details Section */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3 text-neutral-700">Location Details</h3>
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <CustomFormField label="State">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CustomFormField>
              )}
            />
            
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <CustomFormField label="District">
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!watchState || availableDistricts.length === 0}
                  >
                    <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <SelectValue placeholder={watchState ? "Select district" : "Select state first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((district) => (
                        <SelectItem key={district.value} value={district.value}>{district.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CustomFormField>
              )}
            />
            
            <FormField
              control={form.control}
              name="residence"
              render={({ field }) => (
                <CustomFormField label="Residence">
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rural" id="rural" />
                      <label htmlFor="rural" className="text-sm text-neutral-700">Rural</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urban" id="urban" />
                      <label htmlFor="urban" className="text-sm text-neutral-700">Urban</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tribal" id="tribal" />
                      <label htmlFor="tribal" className="text-sm text-neutral-700">Tribal Area</label>
                    </div>
                  </RadioGroup>
                </CustomFormField>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">&#9696;</span> Finding Schemes...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" /> Find Eligible Schemes
              </>
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
}
