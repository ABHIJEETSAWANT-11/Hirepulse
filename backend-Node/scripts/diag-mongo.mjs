// Mongo diagnostic — prints ONLY connection outcomes, never credentials.
// Usage: node scripts/diag-mongo.mjs
import mongoose from "mongoose"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envText = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8")
const getVar = (name) => {
  const m = envText.match(new RegExp("^" + name + "=(.*)$", "m"))
  return m ? m[1].trim() : ""
}
const mask = (s) => String(s).replace(/\/\/[^@/\s]*@/, "//***@").slice(0, 240)

const oldUri = getVar("MONGO_URI_OLD")
const newUri = getVar("MONGO_URI")

async function tryConnect(label, uri) {
  try {
    const c = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
    console.log(`[${label}] SUCCESS -> host: ${c.connection.host}, db: ${c.connection.name || "(default)"}`)
    await mongoose.disconnect()
    return true
  } catch (e) {
    console.log(`[${label}] FAIL -> ${mask(e.message || e)}`)
    try { await mongoose.disconnect() } catch {}
    return false
  }
}

let anyOk = false

if (oldUri) {
  anyOk = (await tryConnect("OLD URI (saved as MONGO_URI_OLD)", oldUri)) || anyOk
}

// New cluster with the OLD URI's password substituted for <db_password>
if (oldUri && newUri.includes("<db_password>")) {
  const oldPass = decodeURIComponent((oldUri.match(/\/\/[^:]+:([^@]+)@/) || [])[1] || "")
  if (oldPass) {
    const candidate = newUri.replace("<db_password>", encodeURIComponent(oldPass))
    anyOk = (await tryConnect("NEW cluster + old URI's password", candidate)) || anyOk
  } else {
    console.log("[NEW cluster + old URI's password] SKIPPED (old URI has no password)")
  }
}

anyOk = (await tryConnect("NEW URI as saved (placeholder intact)", newUri)) || anyOk

console.log(anyOk ? "\n>>> At least one URI works — see above for which." : "\n>>> None connected: fix password in Atlas or whitelist this machine's IP (Network Access).")
process.exit(0)
