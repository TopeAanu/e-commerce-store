// app/api/categories/[categoryId]/products/route.ts
import { NextResponse } from "next/server";
import { CategoryService } from "../../../../lib/category-service";

interface RouteParams {
  params: {
    categoryId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { categoryId } = params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const lastProductId = searchParams.get("lastProductId") || undefined;

    const result = await CategoryService.getProductsByCategory(
      categoryId,
      limit,
      lastProductId
    );

    return NextResponse.json({
      ...result,
      pagination: {
        currentPage: page,
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    console.error("API Error fetching products by category:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
