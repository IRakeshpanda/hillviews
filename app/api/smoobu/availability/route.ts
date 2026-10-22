import { NextResponse } from "next/server";

const SMOOBU_API_KEY = process.env.SMOOBU_API_KEY || "";
const APARTMENT_ID = "1692217";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "Missing start or end date parameters" }, { status: 400 });
  }

  if (!SMOOBU_API_KEY) {
    return NextResponse.json({
      bookedDates: [
        "2026-10-24",
        "2026-10-25",
        "2026-10-26",
        "2026-11-05",
        "2026-11-06",
        "2026-11-07"
      ],
      notice: "Running in preview mode. Add SMOOBU_API_KEY to .env for live sync."
    });
  }

  try {
    const response = await fetch(
      `https://login.smoobu.com/api/rates?apartments[]=${APARTMENT_ID}&start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'Api-Key': SMOOBU_API_KEY,
          'Cache-Control': 'no-cache',
        },
        next: { revalidate: 180 },
      }
    );

    if (!response.ok) {
      throw new Error(`Smoobu API responded with status ${response.status}`);
    }

    const data = await response.json();
    const bookedDates: string[] = [];

    if (data && data.data && data.data[APARTMENT_ID]) {
      Object.entries(data.data[APARTMENT_ID]).forEach(([dateStr, details]: [string, any]) => {
        if (details.available === 0 || details.available === false) {
          bookedDates.push(dateStr);
        }
      });
    }

    return NextResponse.json({ bookedDates });
  } catch (error) {
    console.error('Error fetching live Smoobu availability:', error);
    return NextResponse.json({ bookedDates: [], error: 'Failed to fetch live availability' }, { status: 500 });
  }
}
