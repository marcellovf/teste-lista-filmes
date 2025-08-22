import { NextResponse } from "next/server";
import { startCronJobs } from "@/lib/cron";

let cronJobsInitialized = false;
export async function GET() {
  if (!cronJobsInitialized) {
    console.log('Iniciou cron')
    startCronJobs();
    cronJobsInitialized = true;
    return NextResponse.json({ message: "Cron job iniciado com sucesso!" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Cron job já está em execução." }, { status: 200 });
  }
}
