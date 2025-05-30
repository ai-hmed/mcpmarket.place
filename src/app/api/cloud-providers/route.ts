import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

// GET /api/cloud-providers - Get available cloud providers and regions
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  try {
    // Try to fetch from database first
    const { data: providers, error } = await supabase
      .from("cloud_providers")
      .select("*")
      .eq("active", true)
      .order("name");

    if (error) {
      console.log("Cloud providers table not found, using default data");
    }

    // If no data from database or error, use default providers
    if (!providers || providers.length === 0) {
      const defaultProviders = [
        {
          id: "aws",
          name: "Amazon Web Services",
          regions: [
            { id: "us-east-1", name: "US East (N. Virginia)" },
            { id: "us-west-2", name: "US West (Oregon)" },
            { id: "eu-west-1", name: "EU (Ireland)" },
            { id: "ap-southeast-1", name: "Asia Pacific (Singapore)" },
            { id: "ap-northeast-1", name: "Asia Pacific (Tokyo)" },
          ],
          logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
        },
        {
          id: "azure",
          name: "Microsoft Azure",
          regions: [
            { id: "eastus", name: "East US" },
            { id: "westeurope", name: "West Europe" },
            { id: "southeastasia", name: "Southeast Asia" },
            { id: "westus2", name: "West US 2" },
            { id: "centralus", name: "Central US" },
          ],
          logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
        },
        {
          id: "gcp",
          name: "Google Cloud Platform",
          regions: [
            { id: "us-central1", name: "US Central (Iowa)" },
            { id: "europe-west1", name: "Europe West (Belgium)" },
            { id: "asia-east1", name: "Asia East (Taiwan)" },
            { id: "us-east4", name: "US East (N. Virginia)" },
            {
              id: "australia-southeast1",
              name: "Australia Southeast (Sydney)",
            },
          ],
          logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
        },
      ];

      return NextResponse.json(defaultProviders);
    }

    return NextResponse.json(providers);
  } catch (error) {
    console.error("Error fetching cloud providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch cloud providers" },
      { status: 500 },
    );
  }
}
