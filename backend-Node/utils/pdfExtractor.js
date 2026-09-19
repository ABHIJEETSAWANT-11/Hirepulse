import fs from "fs"
import os from "os"
import path from "path"
import { PDFParse } from "pdf-parse"
import { createWorker } from "tesseract.js"

/**
 * Port of extract_text_from_pdf() from backend-Py/main.py.
 *
 * Primary path (pdfplumber equivalent): pdf-parse (pdf.js) embedded-text
 * extraction. Python's loop does `text += page_text + "\n"` per page and
 * .strip()s at the end, so joining non-empty per-page texts with "\n" and
 * trimming produces identical output. (pdf-parse's concatenated `result.text`
 * injects "-- n of m --" footers, so we join per-page texts ourselves.)
 *
 * OCR fallback (pdf2image + pytesseract equivalent): pdf-parse getScreenshot
 * (scale 2.8 ≈ 200 DPI) rasterizes pages; tesseract.js (pure JS/WASM, chosen
 * Option A) OCRs them — no native binary, so it works on Vercel serverless.
 * Tradeoff accepted vs Option B (native tesseract binary): slightly lower
 * accuracy/speed on noisy scans, but zero host dependencies.
 */
const extractTextFromPdf = async (pdfPath) => {
  let text = ""

  // ---------- Primary: embedded text extraction ----------
  try {
    const data = fs.readFileSync(pdfPath)
    const parser = new PDFParse({ data })
    try {
      const result = await parser.getText()
      text = result.pages
        .map((page) => page.text)
        .filter(Boolean)
        .join("\n")
    } finally {
      await parser.destroy()
    }
  } catch (err) {
    // matches Python: print("PDFPlumber error:", e) → falls through to OCR
    console.log("PDFParse error:", err.message)
  }

  // ---------- Fallback: OCR for scanned/image-only resumes ----------
  if (!text.trim()) {
    const pageImages = await rasterizePages(pdfPath)
    const pageTexts = await runOcr(pageImages)
    // mirror Python: text += ocr_text + "\n" for every page (final .strip()
    // trims the tail; page separators preserved)
    for (const pageText of pageTexts) {
      text += pageText + "\n"
    }
  }

  return text.trim()
}

/**
 * Render every PDF page to a PNG buffer (pdf2image equivalent).
 * Engine-independent — uses pdf-parse v2's bundled pdf.js + canvas.
 * scale 2.8 ≈ pdf2image's default 200 DPI (200/72 ≈ 2.78).
 */
const rasterizePages = async (pdfPath) => {
  const data = fs.readFileSync(pdfPath)
  const parser = new PDFParse({ data })
  try {
    const screenshots = await parser.getScreenshot({ scale: 2.8, imageBuffer: true })
    return screenshots.pages.map((page) => Buffer.from(page.data))
  } finally {
    await parser.destroy()
  }
}

/**
 * OCR engine (Option A): tesseract.js, one worker per request, pages
 * recognized sequentially. Mirrors pytesseract.image_to_string() per
 * pdf2image page image.
 * Traineddata (~5 MB eng) is downloaded once into the OS temp dir and reused
 * across calls on the same machine; set TESSDATA_CACHE_PATH if the default
 * location isn't writable (e.g. some serverless hosts).
 * Contract: takes array of PNG buffers, returns array of raw page texts in
 * the same order, letting the caller apply Python's exact concatenation.
 * Errors propagate to the route handler like Python (OCR failure → the
 * route's catch → 200 {"error": ...}).
 */
const runOcr = async (pageImages) => {
  const cachePath =
    process.env.TESSDATA_CACHE_PATH || path.join(os.tmpdir(), "hirepulse-tessdata")
  const worker = await createWorker("eng", 1, { cachePath })
  try {
    const texts = []
    for (const image of pageImages) {
      const { data } = await worker.recognize(image)
      texts.push(data.text)
    }
    return texts
  } finally {
    await worker.terminate()
  }
}

export { extractTextFromPdf }
