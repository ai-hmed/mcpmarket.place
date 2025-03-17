import { NextRequest, NextResponse } from "next/server";

// GET /api/pricing - Get pricing information for server resources
export async function GET(request: NextRequest) {
  // This is mock data for now
  // In a real application, this would come from a database or external API
  const pricing = {
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

  return NextResponse.json(pricing);
}
