import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "src", "data");
    console.log("Looking for data in:", dataPath);

    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data folder not found at ${dataPath}`);
    }

    const companies = fs
      .readdirSync(dataPath, { withFileTypes: true })
      .filter((dir) => dir.isDirectory())
      .map((dir) => dir.name);

    return NextResponse.json({ companies });
  } catch (err: any) {
    console.error("Error in /api/companies:", err);
    return NextResponse.json(
      { error: err.message || "Failed to read companies" },
      { status: 500 }
    );
  }
}
