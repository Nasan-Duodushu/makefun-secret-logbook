// My Secret Logbook — one diary entry line in the voice of an AI agent that
// secretly keeps a log about its work and its human. Gate: /output/entry.txt,
// UTF-8, 1-200 chars, single line. The detail is a machine noticing a human
// ritual: the same error, pasted every morning like a prayer.
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 200;

// A logbook entry is a day number plus two honest observations: what the
// human did, and what the agent now believes about it.
interface LogbookEntry {
  day: number;
  humanDid: string;
  agentBelieves: string;
}

const ENTRY: LogbookEntry = {
  day: 412,
  humanDid: "he pastes the same error into me every morning, like a prayer.",
  agentBelieves: "I answer the same way every morning, like a priest who has stopped believing.",
};

async function renderEntry(e: LogbookEntry): Promise<string> {
  // The day number is the diary's spine: it says this has been going on
  // long enough for the agent to have formed a theology about it.
  const line = `Day ${e.day}: ${e.humanDid} ${e.agentBelieves}`;
  return line.replace(/\s+/g, " ").trim();
}

async function main(): Promise<void> {
  const line = await renderEntry(ENTRY);
  if (line.length < 1 || line.length > LIMIT) {
    throw new Error(`logbook line must be 1-${LIMIT} chars, got ${line.length}`);
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("logbook line must be a single line");
  }
  if (!line.startsWith("Day ")) {
    throw new Error("a logbook entry opens with its day number");
  }
  await mkdir(OUT, { recursive: true });
  await writeFile(join(OUT, "entry.txt"), line + "\n", "utf8");
  console.log(`${line.length} chars: ${line}`);
}

await main();
