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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  ArrowRight,
  Cloud,
  CreditCard,
  HardDrive,
  Cpu,
  Server,
  Settings,
  Shield,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../supabase/server";

export default async function ConfigureServer({
  searchParams,
}: {
  searchParams: { server?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get the server ID from the query parameters
  const serverId = searchParams.server || "web-server-pro";

  // Fetch server details
  let serverDetails = null;
  try {
    const { data } = await supabase
      .from("servers")
      .select("*")
      .eq("id", serverId)
      .single();

    serverDetails = data;
  } catch (error) {
    console.error("Error fetching server details:", error);
  }

  // If no server details found, use default values
  const serverName = serverDetails?.title || "Web Server Pro";
  const serverDescription =
    serverDetails?.description ||
    "High-performance web server with nginx and PHP support";

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Configure Server</h1>
            <p className="text-muted-foreground">
              Customize your Web Server Pro deployment
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-medium">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="font-medium text-primary">Select Server</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </div>
              <span className="font-medium">Configure</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                3
              </div>
              <span className="text-muted-foreground">Deploy</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Configuration</CardTitle>
                  <CardDescription>
                    Configure the basic settings for your server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="server-name">Server Name</Label>
                    <Input
                      id="server-name"
                      placeholder="My Web Server"
                      defaultValue="Web Server Pro"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="environment">Environment</Label>
                    <Select defaultValue="production">
                      <SelectTrigger id="environment">
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select defaultValue="us-east-1">
                      <SelectTrigger id="region">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">
                          US East (N. Virginia)
                        </SelectItem>
                        <SelectItem value="us-west-1">
                          US West (N. California)
                        </SelectItem>
                        <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                        <SelectItem value="ap-southeast-1">
                          Asia Pacific (Singapore)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>
                    Configure the resources for your server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-500" />
                        <Label>CPU</Label>
                      </div>
                      <span className="text-sm font-medium">2 cores</span>
                    </div>
                    <Slider
                      defaultValue={[2]}
                      max={8}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 core</span>
                      <span>8 cores</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-blue-500" />
                        <Label>Memory</Label>
                      </div>
                      <span className="text-sm font-medium">4 GB</span>
                    </div>
                    <Slider
                      defaultValue={[4]}
                      max={16}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 GB</span>
                      <span>16 GB</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-blue-500" />
                        <Label>Storage</Label>
                      </div>
                      <span className="text-sm font-medium">20 GB</span>
                    </div>
                    <Slider
                      defaultValue={[20]}
                      max={100}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>10 GB</span>
                      <span>100 GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Configure security settings for your server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="firewall">Firewall Protection</Label>
                    </div>
                    <Switch id="firewall" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="ddos">DDoS Protection</Label>
                    </div>
                    <Switch id="ddos" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="ssl">SSL/TLS Encryption</Label>
                    </div>
                    <Switch id="ssl" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <div>
                        <Label htmlFor="intrusion">
                          Advanced Intrusion Detection
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Premium feature
                        </p>
                      </div>
                    </div>
                    <Switch id="intrusion" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced settings for your server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input id="port" placeholder="80" defaultValue="80" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeout">Connection Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      placeholder="30000"
                      defaultValue="30000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-connections">Max Connections</Label>
                    <Input
                      id="max-connections"
                      placeholder="1000"
                      defaultValue="1000"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>
                    Review your server configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">{serverName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {serverDescription}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Environment
                      </span>
                      <span className="text-sm font-medium">Production</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Region
                      </span>
                      <span className="text-sm font-medium">
                        US East (N. Virginia)
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">CPU</span>
                      <span className="text-sm font-medium">2 cores</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Memory
                      </span>
                      <span className="text-sm font-medium">4 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Storage
                      </span>
                      <span className="text-sm font-medium">20 GB</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Firewall
                      </span>
                      <span className="text-sm font-medium text-green-500">
                        Enabled
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        DDoS Protection
                      </span>
                      <span className="text-sm font-medium text-green-500">
                        Enabled
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        SSL/TLS
                      </span>
                      <span className="text-sm font-medium text-green-500">
                        Enabled
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>
                    Estimated cost for your server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Base Price</span>
                      <span className="text-sm font-medium">$20.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">CPU (2 cores)</span>
                      <span className="text-sm font-medium">$10.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Memory (4 GB)</span>
                      <span className="text-sm font-medium">$20.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Storage (20 GB)</span>
                      <span className="text-sm font-medium">$5.00</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total (monthly)</span>
                    <span>$55.00</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <form action="/api/deployments" method="POST">
                    <input type="hidden" name="server_id" value={serverId} />
                    <input type="hidden" name="name" value={serverName} />
                    <input type="hidden" name="provider" value="AWS" />
                    <input type="hidden" name="region" value="us-east-1" />
                    <input
                      type="hidden"
                      name="resources"
                      value='{"cpu":2,"memory":4,"storage":20}'
                    />
                    <input
                      type="hidden"
                      name="configuration"
                      value='{"port":80,"timeout":30000,"maxConnections":1000}'
                    />
                    <input type="hidden" name="cost" value="55.00" />
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Server Selection
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-500">
              Continue to Deployment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
