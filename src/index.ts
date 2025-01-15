import { nip19, getPublicKey, SimplePool, finalizeEvent } from "nostr-tools";
import * as dotenv from "dotenv";
import WebSocket from "ws";

global.WebSocket = WebSocket as any;

dotenv.config();

// Retrieve the nsec key from environment variables
const nsec = process.env.NSEC;

if (!nsec) {
  console.error("NSEC environment variable is missing.");
  process.exit(1);
}

// Decode the private key from the nsec
let sk: Uint8Array;
try {
  sk = nip19.decode(nsec).data as Uint8Array;
} catch (err) {
  console.error("Invalid NSEC key:", (err as Error).message);
  process.exit(1);
}

// Get the public key
let pubkey = getPublicKey(sk);
const npub = nip19.npubEncode(pubkey);
console.log(`Bot npub: ${npub}`);

const relays = process.env.RELAYS?.split(",");

if (!relays) {
  console.error("RELAYS environment variable is missing.");
  process.exit(1);
}

const pool = new SimplePool();

(async () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  let message: string | null = null;

  // Determine the message to publish
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    message = "gfy fiatjaf";
  } else if (today.getDate() % 2 === 1) {
    message = "GM fiatjaf";
  }

  if (!message) {
    console.log("Not posting today.");
    return;
  }

  // Create and sign the event
  const event = finalizeEvent(
    {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: message,
    },
    sk
  );

  // Publish the event
  await Promise.any(pool.publish(relays, event));
  console.log(`Message published: "${message}"`);
  setTimeout(() => pool.close(relays), 10000);
})();
