import { connection } from "next/server";

export async function renderDynamically(): Promise<void> {
  await connection();
}
