
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

interface TrackingNumberModalProps {
  orderId: string;
  currentTrackingNumber?: string;
  recipientName: string;
}

const TrackingNumberModal: React.FC<TrackingNumberModalProps> = ({
  orderId,
  currentTrackingNumber,
  recipientName,
}) => {
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber || "");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin, loading } = useUserRole();

  const updateTrackingMutation = useMutation({
    mutationFn: async (newTrackingNumber: string) => {
      const { data, error } = await supabase
        .from("shipping_orders")
        .update({ tracking_number: newTrackingNumber })
        .eq("id", orderId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-details", orderId] });
      toast({
        title: "Success",
        description: "Tracking number updated successfully",
      });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update tracking number",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTrackingMutation.mutate(trackingNumber);
  };

  // Don't render the button if user is not admin or still loading
  if (loading || !isAdmin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="ml-2"
        >
          {currentTrackingNumber ? (
            <>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </>
          ) : (
            <>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentTrackingNumber ? "Edit" : "Add"} Tracking Number
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Order for: {recipientName}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tracking">Tracking Number</Label>
            <Input
              id="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateTrackingMutation.isPending}
            >
              {updateTrackingMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrackingNumberModal;
