"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Check,
  Cloud,
  HelpCircle,
  Info,
  Server,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function SubmitServerPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    shortDescription: "",
    fullDescription: "",
    features: ["", "", ""],
    specs: {
      cpu: "",
      memory: "",
      storage: "",
      network: "",
      os: "",
    },
    providers: [
      { name: "AWS", selected: false, regions: [] as string[] },
      { name: "Azure", selected: false, regions: [] as string[] },
      { name: "GCP", selected: false, regions: [] as string[] },
    ],
    pricing: {
      model: "free",
      amount: 0,
    },
    documentation: "",
    image: null,
  });

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Transform form data to match API expectations
      const submitData = {
        title: formData.name,
        description: formData.fullDescription,
        shortDescription: formData.shortDescription,
        category: formData.category,
        features: formData.features.filter((f) => f.trim() !== ""),
        specs: formData.specs,
        providers: formData.providers
          .filter((p) => p.selected)
          .map((p) => ({
            name: p.name,
            regions: p.regions,
          })),
        pricing: formData.pricing,
        status: "draft", // Submitted servers start as draft for review
      };

      const response = await fetch("/api/servers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit server");
      }

      const result = await response.json();

      // Redirect to success page with server ID
      window.location.href = `/dashboard/developer/submit/success?id=${result.id}`;
    } catch (error) {
      console.error("Error submitting server:", error);
      alert(
        `Failed to submit server: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/developer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold">Submit New Server</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= step ? "bg-blue-600 text-white" : "bg-secondary text-muted-foreground"}`}
                >
                  {activeStep > step ? <Check className="h-5 w-5" /> : step}
                </div>
                <span
                  className={`text-xs mt-2 ${activeStep >= step ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step === 1
                    ? "Basic Info"
                    : step === 2
                      ? "Technical Details"
                      : step === 3
                        ? "Providers & Pricing"
                        : "Documentation"}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {activeStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide general information about your server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Server Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Web Server Pro"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Web">Web Server</option>
                      <option value="Database">Database</option>
                      <option value="Runtime">Runtime Environment</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Container">Container/Kubernetes</option>
                      <option value="DevOps">DevOps Tools</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Input
                      id="shortDescription"
                      placeholder="Brief description (max 100 characters)"
                      maxLength={100}
                      value={formData.shortDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shortDescription: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This will appear in server cards and search results
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullDescription">Full Description</Label>
                    <Textarea
                      id="fullDescription"
                      placeholder="Detailed description of your server"
                      rows={5}
                      value={formData.fullDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullDescription: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Key Features (at least 3)</Label>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder={`Feature ${index + 1}`}
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[index] = e.target.value;
                            setFormData({ ...formData, features: newFeatures });
                          }}
                          required
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          features: [...formData.features, ""],
                        })
                      }
                    >
                      Add Feature
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Server Image</Label>
                    <div className="border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop an image, or click to browse
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="image"
                        accept="image/*"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("image")?.click()
                        }
                      >
                        Upload Image
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Recommended size: 1200x800px, max 2MB
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="button" onClick={handleNext}>
                    Continue to Technical Details
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 2: Technical Details */}
            {activeStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                  <CardDescription>
                    Specify the technical specifications of your server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cpu">CPU</Label>
                      <Input
                        id="cpu"
                        placeholder="e.g. 4 vCPUs"
                        value={formData.specs.cpu}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specs: { ...formData.specs, cpu: e.target.value },
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="memory">Memory</Label>
                      <Input
                        id="memory"
                        placeholder="e.g. 8 GB RAM"
                        value={formData.specs.memory}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specs: {
                              ...formData.specs,
                              memory: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storage">Storage</Label>
                      <Input
                        id="storage"
                        placeholder="e.g. 100 GB SSD"
                        value={formData.specs.storage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specs: {
                              ...formData.specs,
                              storage: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="network">Network</Label>
                      <Input
                        id="network"
                        placeholder="e.g. 1 Gbps"
                        value={formData.specs.network}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specs: {
                              ...formData.specs,
                              network: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="os">Operating System</Label>
                    <Input
                      id="os"
                      placeholder="e.g. Ubuntu 22.04 LTS"
                      value={formData.specs.os}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: { ...formData.specs, os: e.target.value },
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Software Stack</Label>
                    <Tabs defaultValue="packages">
                      <TabsList className="mb-4">
                        <TabsTrigger value="packages">Packages</TabsTrigger>
                        <TabsTrigger value="configuration">
                          Configuration
                        </TabsTrigger>
                        <TabsTrigger value="scripts">Scripts</TabsTrigger>
                      </TabsList>

                      <TabsContent value="packages" className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-md flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                          <p className="text-sm">
                            List all packages and dependencies required for your
                            server.
                          </p>
                        </div>

                        <Textarea
                          placeholder="e.g. nginx 1.18.0, php 8.2, mariadb 10.6"
                          rows={5}
                        />
                      </TabsContent>

                      <TabsContent value="configuration" className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-md flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                          <p className="text-sm">
                            Describe any specific configuration settings
                            required.
                          </p>
                        </div>

                        <Textarea
                          placeholder="e.g. Custom nginx configuration, PHP settings, etc."
                          rows={5}
                        />
                      </TabsContent>

                      <TabsContent value="scripts" className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-md flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                          <p className="text-sm">
                            Provide any initialization or setup scripts
                            required.
                          </p>
                        </div>

                        <Textarea
                          placeholder="#!/bin/bash\n# Your initialization script here"
                          rows={5}
                          className="font-mono"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="space-y-2">
                    <Label>Performance Benchmarks</Label>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm mb-4">
                        Provide performance metrics for your server
                        configuration:
                      </p>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="benchmark1">
                            HTTP Request Handling (req/sec)
                          </Label>
                          <Input
                            id="benchmark1"
                            placeholder="e.g. 10000"
                            type="number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="benchmark2">
                            Database Transactions (tx/sec)
                          </Label>
                          <Input
                            id="benchmark2"
                            placeholder="e.g. 5000"
                            type="number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="benchmark3">
                            File System I/O (MB/s)
                          </Label>
                          <Input
                            id="benchmark3"
                            placeholder="e.g. 500"
                            type="number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext}>
                    Continue to Providers & Pricing
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 3: Providers & Pricing */}
            {activeStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Providers & Pricing</CardTitle>
                  <CardDescription>
                    Specify supported cloud providers and pricing model
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Supported Cloud Providers</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {formData.providers.map((provider, index) => (
                        <div
                          key={index}
                          className={`border rounded-md p-4 cursor-pointer transition-all ${provider.selected ? "border-blue-500 bg-blue-500/5" : "border-border"}`}
                          onClick={() => {
                            const newProviders = [...formData.providers];
                            newProviders[index].selected =
                              !newProviders[index].selected;
                            setFormData({
                              ...formData,
                              providers: newProviders,
                            });
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{provider.name}</span>
                            {provider.selected && (
                              <Check className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {provider.name === "AWS"
                              ? "Amazon Web Services"
                              : provider.name === "Azure"
                                ? "Microsoft Azure"
                                : "Google Cloud Platform"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Supported Regions</Label>
                    <div className="bg-muted/50 p-4 rounded-md">
                      {formData.providers.some((p) => p.selected) ? (
                        <div className="space-y-4">
                          {formData.providers
                            .filter((p) => p.selected)
                            .map((provider, index) => (
                              <div key={index} className="space-y-2">
                                <Label>{provider.name} Regions</Label>
                                <div className="flex flex-wrap gap-2">
                                  {provider.name === "AWS"
                                    ? [
                                        "us-east-1",
                                        "us-west-2",
                                        "eu-west-1",
                                        "ap-southeast-1",
                                        "ap-northeast-1",
                                      ]
                                    : provider.name === "Azure"
                                      ? [
                                          "eastus",
                                          "westeurope",
                                          "southeastasia",
                                          "westus2",
                                          "centralus",
                                        ]
                                      : [
                                          "us-central1",
                                          "europe-west1",
                                          "asia-east1",
                                          "us-east4",
                                          "australia-southeast1",
                                        ].map((region, idx) => (
                                          <Badge
                                            key={idx}
                                            variant={
                                              provider.regions.includes(region)
                                                ? "default"
                                                : "outline"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => {
                                              const newProviders = [
                                                ...formData.providers,
                                              ];
                                              const providerIndex =
                                                newProviders.findIndex(
                                                  (p) =>
                                                    p.name === provider.name,
                                                );
                                              if (
                                                newProviders[
                                                  providerIndex
                                                ].regions.includes(region)
                                              ) {
                                                newProviders[
                                                  providerIndex
                                                ].regions = newProviders[
                                                  providerIndex
                                                ].regions.filter(
                                                  (r) => r !== region,
                                                );
                                              } else {
                                                newProviders[
                                                  providerIndex
                                                ].regions.push(region);
                                              }
                                              setFormData({
                                                ...formData,
                                                providers: newProviders,
                                              });
                                            }}
                                          >
                                            {region}
                                          </Badge>
                                        ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-4">
                          <p className="text-sm text-muted-foreground">
                            Please select at least one cloud provider
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pricing Model</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          id: "free",
                          name: "Free",
                          description: "Available to all users at no cost",
                        },
                        {
                          id: "paid",
                          name: "Paid",
                          description: "One-time payment for deployment",
                        },
                        {
                          id: "subscription",
                          name: "Subscription",
                          description: "Recurring monthly payment",
                        },
                      ].map((model) => (
                        <div
                          key={model.id}
                          className={`border rounded-md p-4 cursor-pointer transition-all ${formData.pricing.model === model.id ? "border-blue-500 bg-blue-500/5" : "border-border"}`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              pricing: { ...formData.pricing, model: model.id },
                            })
                          }
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{model.name}</span>
                            {formData.pricing.model === model.id && (
                              <Check className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {model.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {formData.pricing.model !== "free" && (
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USD)</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          $
                        </span>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          className="rounded-l-none"
                          value={formData.pricing.amount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pricing: {
                                ...formData.pricing,
                                amount: parseFloat(e.target.value),
                              },
                            })
                          }
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formData.pricing.model === "paid"
                          ? "One-time payment per deployment"
                          : "Monthly subscription fee"}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Estimated Costs</Label>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm mb-4">
                        Provide estimated monthly costs for running this server:
                      </p>

                      <div className="space-y-4">
                        {formData.providers
                          .filter((p) => p.selected)
                          .map((provider, index) => (
                            <div key={index} className="space-y-2">
                              <Label htmlFor={`cost-${provider.name}`}>
                                {provider.name} Estimated Cost (USD/month)
                              </Label>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                  $
                                </span>
                                <Input
                                  id={`cost-${provider.name}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="rounded-l-none"
                                  placeholder="e.g. 20.00"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext}>
                    Continue to Documentation
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 4: Documentation */}
            {activeStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Provide comprehensive documentation for your server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="documentation">
                        Getting Started Guide
                      </Label>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <HelpCircle className="h-3 w-3" />
                        <span>Markdown supported</span>
                      </div>
                    </div>
                    <Textarea
                      id="documentation"
                      placeholder="Provide step-by-step instructions for deploying and using your server"
                      rows={10}
                      value={formData.documentation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          documentation: e.target.value,
                        })
                      }
                      required
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Include deployment instructions, configuration options,
                      and usage examples
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Documentation</Label>
                    <div className="border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files, or click to browse
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="docs"
                        multiple
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("docs")?.click()}
                      >
                        Upload Files
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Accepted formats: PDF, MD, DOC, DOCX (max 10MB each)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Support Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="supportEmail">Support Email</Label>
                        <Input
                          id="supportEmail"
                          type="email"
                          placeholder="e.g. support@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="supportUrl">Support URL</Label>
                        <Input
                          id="supportUrl"
                          type="url"
                          placeholder="e.g. https://example.com/support"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <Button type="submit" className="w-full">
                      Submit Server
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      By submitting, you agree to our terms and conditions for
                      server submissions. Your server will be reviewed before
                      being published to the marketplace.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
