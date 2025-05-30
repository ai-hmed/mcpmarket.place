import { NextRequest, NextResponse } from "next/server";

// GET /api/pricing - Get pricing information for server resources
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cpu = parseInt(searchParams.get("cpu") || "0");
  const memory = parseInt(searchParams.get("memory") || "0");
  const storage = parseInt(searchParams.get("storage") || "0");
  const provider = searchParams.get("provider") || "aws";

  // Base pricing structure - in production, this would come from a database
  const basePricing = {
    base: 20.0,
    cpu: {
      1: 5.0,
      2: 10.0,
      4: 18.0,
      8: 32.0,
      16: 60.0,
    },
    memory: {
      1: 5.0,
      2: 10.0,
      4: 20.0,
      8: 35.0,
      16: 65.0,
      32: 120.0,
      64: 220.0,
    },
    storage: {
      10: 2.5,
      20: 5.0,
      50: 12.0,
      100: 22.0,
      200: 40.0,
      500: 95.0,
      1000: 180.0,
    },
    premium_features: {
      advanced_intrusion_detection: 15.0,
      ddos_protection: 25.0,
      backup_service: 10.0,
      monitoring: 8.0,
    },
    provider_multipliers: {
      aws: 1.0,
      azure: 1.1,
      gcp: 0.95,
    },
    discounts: {
      annual_payment: 0.1, // 10% discount
      new_customer: 0.15, // 15% discount
      volume: {
        5: 0.05, // 5% discount for 5+ servers
        10: 0.1, // 10% discount for 10+ servers
        20: 0.15, // 15% discount for 20+ servers
      },
    },
  };

  // If specific resources are requested, calculate the price
  if (cpu || memory || storage) {
    const cpuCost = basePricing.cpu[cpu as keyof typeof basePricing.cpu] || 0;
    const memoryCost =
      basePricing.memory[memory as keyof typeof basePricing.memory] || 0;
    const storageCost =
      basePricing.storage[storage as keyof typeof basePricing.storage] || 0;

    const subtotal = basePricing.base + cpuCost + memoryCost + storageCost;
    const providerMultiplier =
      basePricing.provider_multipliers[
        provider as keyof typeof basePricing.provider_multipliers
      ] || 1.0;
    const total = subtotal * providerMultiplier;

    return NextResponse.json({
      breakdown: {
        base: basePricing.base,
        cpu: cpuCost,
        memory: memoryCost,
        storage: storageCost,
        subtotal,
        provider_multiplier: providerMultiplier,
        total: Math.round(total * 100) / 100,
      },
      pricing: basePricing,
    });
  }

  return NextResponse.json(basePricing);
}
