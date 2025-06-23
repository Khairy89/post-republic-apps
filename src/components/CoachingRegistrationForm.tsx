
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";

interface CoachingRegistrationFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const CoachingRegistrationForm: React.FC<CoachingRegistrationFormProps> = ({ onSuccess, onBack }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "",
    goalsChallenges: "",
    privacyAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.preferredContact) {
      newErrors.preferredContact = "Please select a preferred contact method";
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = "You must accept the privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form for any missing or invalid information.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('coaching_registrations')
        .insert([
          {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            preferred_contact: formData.preferredContact,
            goals_challenges: formData.goalsChallenges.trim() || null,
            privacy_accepted: formData.privacyAccepted,
          }
        ]);

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Registration failed",
          description: "There was an error saving your information. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Registration successful!",
        description: "Your information has been saved. We'll contact you soon.",
      });

      onSuccess();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle className="text-2xl">Register for Coaching</CardTitle>
            <CardDescription>
              Personal Coaching Session - RM500
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+60123456789"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Preferred Contact Method *</Label>
            <Select 
              value={formData.preferredContact} 
              onValueChange={(value) => handleInputChange("preferredContact", value)}
            >
              <SelectTrigger className={errors.preferredContact ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your preferred contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            {errors.preferredContact && (
              <p className="text-sm text-red-500">{errors.preferredContact}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Any specific goals or challenges? (Optional)</Label>
            <Textarea
              id="goals"
              value={formData.goalsChallenges}
              onChange={(e) => handleInputChange("goalsChallenges", e.target.value)}
              placeholder="Tell us about your current situation, goals, or specific challenges you'd like to address during the coaching session..."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacy"
              checked={formData.privacyAccepted}
              onCheckedChange={(checked) => handleInputChange("privacyAccepted", checked as boolean)}
            />
            <Label htmlFor="privacy" className="text-sm">
              I accept the{" "}
              <a href="/privacy-policy" className="text-primary hover:underline" target="_blank">
                Privacy Policy
              </a>{" "}
              and agree to be contacted regarding this coaching service. *
            </Label>
          </div>
          {errors.privacyAccepted && (
            <p className="text-sm text-red-500">{errors.privacyAccepted}</p>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What happens next?</h4>
            <p className="text-sm text-muted-foreground">
              After registration, we'll contact you within 24 hours to schedule your session and provide payment details. 
              Payment processing integration is coming soon!
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CoachingRegistrationForm;
