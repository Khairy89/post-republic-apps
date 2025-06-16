import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import TrackingNumberModal from "@/components/TrackingNumberModal";

const fetchOrderById = async (id: string) => {
  const { data, error } = await supabase
    .from("shipping_orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order-details", id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto pt-10 space-y-4">
        <div className="text-destructive font-medium">Order not found or error loading order details.</div>
        <Link to="/orders"><Button variant="outline"><ArrowLeft className="mr-2" /> Back to Orders</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-10 pb-20 px-3">
      <Link to="/orders">
        <Button variant="outline" className="mb-5"><ArrowLeft className="mr-2" />Back to Orders</Button>
      </Link>
      <h2 className="text-xl font-bold mb-4">Order Details</h2>
      <div className="border p-4 rounded-lg bg-background shadow-sm">
        <div className="mb-2"><span className="font-medium">Status:</span> <span className="capitalize">{order.status || "pending"}</span></div>
        <div className="mb-2">
          <span className="font-medium">Tracking Number:</span> 
          <div className="inline-flex items-center ml-2">
            {order.tracking_number ? (
              <a
                href={`https://www.dhl.com/en/express/tracking.html?AWB=${order.tracking_number}&brand=DHL`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
              >
                {order.tracking_number}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-muted-foreground text-sm">Not available</span>
            )}
            <TrackingNumberModal
              orderId={order.id}
              currentTrackingNumber={order.tracking_number}
              recipientName={order.recipient_name}
            />
          </div>
        </div>
        <div className="mb-2"><span className="font-medium">Recipient:</span> {order.recipient_name}</div>
        <div className="mb-2"><span className="font-medium">Destination:</span> {order.address}, {order.zip}, {order.city}, {order.state}, {order.country}</div>
        <div className="mb-2"><span className="font-medium">Phone:</span> {order.phone}</div>
        <div className="mb-2"><span className="font-medium">Created:</span> {new Date(order.created_at).toLocaleString()}</div>
        <div className="mb-2"><span className="font-medium">Parcel:</span> {order.length} × {order.width} × {order.height}cm, {order.weight}kg</div>
        <div className="mb-2"><span className="font-medium">Chargeable Weight:</span> {order.chargeable_weight}kg (Actual: {order.actual_weight}kg, Volumetric: {order.volumetric_weight}kg)</div>
        <div className="mb-2"><span className="font-medium">Zone:</span> {order.zone_number || "N/A"}</div>
        <hr className="my-3"/>
        <div className="mb-2"><span className="font-medium">Base Price:</span> RM{order.base_price?.toFixed(2)}</div>
        <div className="mb-2"><span className="font-medium">Fuel Surcharge:</span> RM{order.fuel_surcharge?.toFixed(2)}</div>
        <div className="mb-2"><span className="font-medium">Handling Fee:</span> RM{order.handling_fee?.toFixed(2)}</div>
        {order.repacking && <div className="mb-2"><span className="font-medium">Repacking Fee:</span> RM{order.repacking_fee?.toFixed(2)}</div>}
        <div className="text-lg mt-4"><b>Total:</b> <span className="font-bold text-primary">RM{order.total_price?.toFixed(2)}</span></div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
