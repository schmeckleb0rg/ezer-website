import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page");

  if (!page) {
    return NextResponse.json({ error: "page param required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("page_images")
    .select("*")
    .eq("page", page)
    .order("sort_order");

  if (error) {
    return NextResponse.json({ images: [] });
  }

  return NextResponse.json({ images: data || [] });
}
