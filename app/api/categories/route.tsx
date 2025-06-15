// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { CategoryService } from "../../lib/category-service";

export async function GET() {
  try {
    const categories = await CategoryService.getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("API Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
