import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import aj, { detectBot, shield } from "@/lib/arcjet";
import { headers } from "next/headers";
import { ArcjetNextRequest } from "@arcjet/next";

export const runtime = "nodejs"; // Run heavy code in Node, not Edge

export async function GET(req: Request) {
  try {
    // Check user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Create Arcjet validation
    const validate = aj
      .withRule(shield({ mode: "LIVE" }))
      .withRule(
        detectBot({
          mode: "LIVE",
          allow: ["CATEGORY:SEARCH_ENGINE", "G00G1E_CRAWLER"],
        })
      );

    // call validate on the request
    await validate.protect( req as ArcjetNextRequest );

    // If validate passes, session check determines validity
    const valid = !!session;

    return NextResponse.json({ valid });
  } catch (error) {
    console.error("Check-session error:", error);
    // If validate or session fails, mark as invalid
    return NextResponse.json({ valid: false });
  }
}
