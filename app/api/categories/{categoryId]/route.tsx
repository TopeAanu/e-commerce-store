// app/api/categories/[categoryId]/route.tsx
import { NextResponse } from "next/server";
import { CategoryService } from "../../../lib/category-service";

interface RouteParams {
  params: {
    categoryId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { categoryId } = params;
    const category = await CategoryService.getCategoryById(categoryId);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("API Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
