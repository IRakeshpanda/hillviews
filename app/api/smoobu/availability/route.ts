import { NextResponse } from "next/server";
import { buildSmoobuHeaders } from "../../../../lib/smoobuHmac";

const SMOOBU_API_KEY = process.env.SMOOBU_API_KEY || process.env.textSMOOBU_API_KEY || "";
const SMOOBU_API_SECRET = process.env.SMOOBU_API_SECRET || "";
const APARTMENT_ID = process.env.SMOOBU_HILL_VIEW_APARTMENT_ID || "";

function normalizeBookedDates(data: any, apartmentId: string): string[] {
  const apartmentData = data?.data?.[apartmentId] ?? data?.[apartmentId] ?? {};

  return Object.entries(apartmentData)
    .filter(([, details]: [string, any]) => {
      const available = details?.available;
      return available === 0 || available === false;
    })
    .map(([date]) => date);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "Missing start or end date parameters" }, { status: 400 });
  }

  if (!SMOOBU_API_KEY || !SMOOBU_API_SECRET || !APARTMENT_ID) {
    return NextResponse.json({
      bookedDates: [],
      notice: "Smoobu availability is not configured yet. Add SMOOBU_API_KEY, SMOOBU_API_SECRET, and SMOOBU_HILL_VIEW_APARTMENT_ID to your environment.",
    }, { status: 500 });
  }

  const requestUrl = new URL("https://login.smoobu.com/api/rates");
  requestUrl.searchParams.set("apartments[]", APARTMENT_ID);
  requestUrl.searchParams.set("start_date", startDate);
  requestUrl.searchParams.set("end_date", endDate);

  const path = `${requestUrl.pathname}${requestUrl.search}`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...buildSmoobuHeaders("GET", path, "", SMOOBU_API_KEY, SMOOBU_API_SECRET),
      },
      next: { revalidate: 180 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Smoobu availability fetch failed", { status: response.status, body: errorText });
      return NextResponse.json({ bookedDates: [], error: "Smoobu availability request failed." }, { status: 502 });
    }

    const data = await response.json();
    const bookedDates = normalizeBookedDates(data, APARTMENT_ID);

    return NextResponse.json({ bookedDates, notice: "Live availability synced for Hill View Stone Cottage." });
  } catch (error) {
    console.error("Error fetching live Smoobu availability:", error);
    return NextResponse.json({ bookedDates: [], error: "Failed to fetch live availability." }, { status: 500 });
  }
}
