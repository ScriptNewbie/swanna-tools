import { createWorker } from "tesseract.js";

export const ocr = async (file: File | undefined) => {
  if (file) {
    const worker = await createWorker("pol");
    const ret = await worker.recognize(file);

    await worker.terminate();
    return ret.data.text
      .split("\n\n")
      .map((string) => string.replace(/\n/g, " ").replace(/—/, "-"));
  }
};
