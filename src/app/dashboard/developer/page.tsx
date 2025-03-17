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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  BarChart2,
  Code,
  FileText,
  InfoIcon,
  Plus,
  Server,
  Upload,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function DeveloperPortal() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">Developer Portal</h1>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Submit New Server
              </Button>
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Welcome to the developer portal. Here you can submit, manage,
                and track your mCP servers.
              </span>
            </div>
          </header>

          {/* Main Content */}
          <Tabs defaultValue="servers" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="servers">My Servers</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>

            {/* My Servers Tab */}
            <TabsContent value="servers" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Server Cards */}
                {[
                  {
                    name: "Node.js Runtime",
                    description:
                      "Optimized Node.js environment for modern JavaScript applications",
                    status: "Published",
                    deployments: 2103,
                    lastUpdated: "2023-09-15",
                  },
                  {
                    name: "PostgreSQL Database",
                    description:
                      "High-performance PostgreSQL database with automated backups",
                    status: "Under Review",
                    deployments: 0,
                    lastUpdated: "2023-10-20",
                  },
                  {
                    name: "React Development Stack",
                    description:
                      "Complete React development environment with testing tools",
                    status: "Draft",
                    deployments: 0,
                    lastUpdated: "2023-10-25",
                  },
                ].map((server, index) => (
                  <Card
                    key={index}
                    className="border border-border hover:shadow-md transition-all"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{server.name}</CardTitle>
                        <div
                          className={`px-2 py-1 text-xs rounded-full ${server.status === "Published" ? "bg-green-500/20 text-green-500" : server.status === "Under Review" ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500"}`}
                        >
                          {server.status}
                        </div>
                      </div>
                      <CardDescription>
                        Last updated: {server.lastUpdated}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {server.description}
                      </p>
                      {server.status === "Published" && (
                        <div className="flex items-center gap-2 text-sm">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {server.deployments.toLocaleString()} deployments
                          </span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      {server.status === "Published" ? (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500"
                        >
                          View Analytics
                        </Button>
                      ) : server.status === "Under Review" ? (
                        <Button size="sm" variant="secondary">
                          Check Status
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500"
                        >
                          Submit for Review
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}

                {/* Add New Server Card */}
                <Card className="border border-dashed border-border bg-card/50 hover:bg-card/80 transition-all cursor-pointer flex flex-col items-center justify-center py-12">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Submit New Server
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-[200px] mb-4">
                    Create and publish your own mCP server template
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-500">
                    Get Started
                  </Button>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Deployments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">2,103</div>
                      <div className="text-sm text-green-500 flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                        <span>+12.5%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Compared to last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Instances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">1,845</div>
                      <div className="text-sm text-green-500 flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                        <span>+8.3%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Compared to last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">4.8/5</div>
                      <div className="text-sm text-green-500 flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                        <span>+0.2</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on 156 reviews
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Deployment Trends</CardTitle>
                  <CardDescription>
                    Monthly deployment statistics for your servers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full flex items-end justify-between gap-2 pt-6">
                    {[
                      { month: "Jan", value: 45 },
                      { month: "Feb", value: 60 },
                      { month: "Mar", value: 75 },
                      { month: "Apr", value: 85 },
                      { month: "May", value: 110 },
                      { month: "Jun", value: 130 },
                      { month: "Jul", value: 145 },
                      { month: "Aug", value: 160 },
                      { month: "Sep", value: 175 },
                      { month: "Oct", value: 200 },
                      { month: "Nov", value: 220 },
                      { month: "Dec", value: 250 },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-2 flex-1"
                      >
                        <div
                          className="w-full bg-blue-600 rounded-t-sm"
                          style={{ height: `${(item.value / 250) * 100}%` }}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Deployment by Region</CardTitle>
                    <CardDescription>
                      Geographic distribution of deployments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { region: "North America", percentage: 45 },
                        { region: "Europe", percentage: 30 },
                        { region: "Asia Pacific", percentage: 15 },
                        { region: "South America", percentage: 7 },
                        { region: "Africa", percentage: 3 },
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.region}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Deployment by Provider</CardTitle>
                    <CardDescription>
                      Cloud provider distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { provider: "AWS", percentage: 50 },
                        { provider: "Azure", percentage: 25 },
                        { provider: "Google Cloud", percentage: 20 },
                        { provider: "DigitalOcean", percentage: 5 },
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.provider}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="documentation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Developer Documentation</CardTitle>
                  <CardDescription>
                    Resources for creating and publishing mCP servers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Getting Started",
                        description: "Learn the basics of creating mCP servers",
                        icon: <FileText className="h-8 w-8 text-blue-500" />,
                      },
                      {
                        title: "Server Specification",
                        description:
                          "Technical requirements and best practices",
                        icon: <Code className="h-8 w-8 text-blue-500" />,
                      },
                      {
                        title: "Submission Guidelines",
                        description: "How to submit your server for review",
                        icon: <Upload className="h-8 w-8 text-blue-500" />,
                      },
                      {
                        title: "Analytics API",
                        description: "Access deployment data programmatically",
                        icon: <BarChart2 className="h-8 w-8 text-blue-500" />,
                      },
                      {
                        title: "Version Management",
                        description: "How to update and maintain your servers",
                        icon: <Server className="h-8 w-8 text-blue-500" />,
                      },
                      {
                        title: "Monetization",
                        description: "Options for monetizing your servers",
                        icon: (
                          <svg
                            className="h-8 w-8 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ),
                      },
                    ].map((doc, index) => (
                      <Card
                        key={index}
                        className="border border-border hover:shadow-sm transition-all"
                      >
                        <CardHeader className="pb-2">
                          <div className="mb-2">{doc.icon}</div>
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {doc.description}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="ghost"
                            className="w-full text-blue-500 hover:text-blue-600 hover:bg-blue-50/10"
                          >
                            Read Documentation
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      question: "How do I submit a server for review?",
                      answer:
                        "To submit a server, click the 'Submit New Server' button at the top of the Developer Portal. Fill out the required information about your server, upload any necessary files, and submit for review. Our team typically reviews submissions within 3-5 business days.",
                    },
                    {
                      question:
                        "What are the requirements for server submissions?",
                      answer:
                        "All servers must include complete documentation, meet our performance benchmarks, and follow security best practices. Servers should be thoroughly tested and include all necessary configuration files and dependencies.",
                    },
                    {
                      question: "How do I update an existing server?",
                      answer:
                        "To update a server, navigate to 'My Servers' tab, find the server you want to update, and click 'Edit'. Make your changes and submit the new version for review. Once approved, users will be notified of the update.",
                    },
                    {
                      question: "How is revenue shared for paid servers?",
                      answer:
                        "For paid servers, developers receive 70% of the revenue after payment processing fees. Payments are made monthly for balances over $50. You can view your current earnings in the Analytics tab.",
                    },
                  ].map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <h3 className="font-medium mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
