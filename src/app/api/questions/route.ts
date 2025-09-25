import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company");
    const timeframe = searchParams.get("timeframe");

    if (!company || !timeframe) {
      return NextResponse.json(
        { error: "company and timeframe are required" },
        { status: 400 }
      );
    }

    // Example: src/data/accenture/six-months.csv
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      company,
      `${timeframe}.csv`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "CSV file not found" },
        { status: 404 }
      );
    }

    const csvData = fs.readFileSync(filePath, "utf8");

    const { data } = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
