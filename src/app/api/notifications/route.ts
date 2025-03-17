import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In a real implementation, you would fetch notifications from the database
  // For now, we'll return mock data
  const mockNotifications = [
    {
      id: "1",
      title: "Deployment Successful",
      message: "Your server has been deployed successfully.",
      type: "success",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: "2",
      title: "New Server Available",
      message: "A new server has been added to the catalog.",
      type: "info",
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: "3",
      title: "Server Update",
      message: "One of your saved servers has been updated.",
      type: "info",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
  ];

  return NextResponse.json(mockNotifications);
}

// PATCH /api/notifications/:id - Mark notification as read
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 },
      );
    }

    // In a real implementation, you would update the notification in the database
    // For now, we'll just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/notifications/:id - Delete a notification
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Notification ID is required" },
      { status: 400 },
    );
  }

  // In a real implementation, you would delete the notification from the database
  // For now, we'll just return success
  return NextResponse.json({ success: true });
}
