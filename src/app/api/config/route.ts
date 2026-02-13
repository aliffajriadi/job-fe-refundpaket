import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "src/config.json");

function readConfig() {
  try {
    const data = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { telegramDisabled: false, webDisabled: false };
  }
}

function writeConfig(config: any) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

export async function GET() {
  const config = readConfig();
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const config = readConfig();

    if (typeof body.telegramDisabled === "boolean") {
      config.telegramDisabled = body.telegramDisabled;
    }
    if (typeof body.webDisabled === "boolean") {
      config.webDisabled = body.webDisabled;
    }

    writeConfig(config);
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
