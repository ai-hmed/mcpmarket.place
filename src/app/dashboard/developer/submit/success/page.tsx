"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ArrowRight, Server } from "lucide-react";
import { createClient } from "../../../../../../supabase/client";

export default function SubmitSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </div>
      }>
        <SubmitSuccessContent />
      </Suspense>
    </div>
  );
}

function SubmitSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serverId = searchParams.get("id");
  const [serverDetails, setServerDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServerDetails = async () => {
      if (!serverId) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("servers")
          .select("*")
          .eq("id", serverId)
          .single();

        if (error) {
          console.error("Error fetching server details:", error);
        } else {
          setServerDetails(data);
        }
      } catch (error) {
        console.error("Error in fetchServerDetails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServerDetails();
  }, [serverId]);

  return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border bg-card">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Submission Successful!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your MCP server has been submitted for review.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Loading server details...
                  </p>
                </div>
              ) : serverDetails ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-background">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                      <Server className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{serverDetails.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {serverDetails.short_description}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-background">
                    <h3 className="font-medium mb-2">What happens next?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our team will review your submission to ensure it meets
                      our quality standards. This typically takes 1-2 business
                      days. You'll receive a notification once the review is
                      complete.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">
                        Status:{" "}
                        <span className="text-amber-500">Pending Review</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Server details not found. Your submission was received, but
                    we couldn't load the details.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/developer" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">
                  Return to Developer Dashboard
                </Button>
              </Link>
              {serverDetails && (
                <Link
                  href={`/dashboard/servers/${serverDetails.id}`}
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full">
                    View Server Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
}
