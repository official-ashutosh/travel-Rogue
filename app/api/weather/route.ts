import { NextRequest, NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeName = searchParams.get("placeName");
  if (!placeName) {
    return NextResponse.json({ error: "Missing placeName" }, { status: 400 });
  }
  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json({ error: "Missing OpenWeather API key" }, { status: 500 });
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      placeName
    )}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
