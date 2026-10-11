import PDFKit; import AppKit
// render.swift in.pdf outprefix  -> outprefix-p1.png ... (1240px Breite, ~150 dpi)
let doc = PDFDocument(url: URL(fileURLWithPath: CommandLine.arguments[1]))!
print("pages", doc.pageCount)
for i in 0..<doc.pageCount {
  let page = doc.page(at: i)!
  let b = page.bounds(for: .mediaBox)
  let scale: CGFloat = 1240.0 / b.width
  let w = Int(b.width*scale), h = Int(b.height*scale)
  let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
  NSGraphicsContext.saveGraphicsState()
  let ctx = NSGraphicsContext(bitmapImageRep: rep)!
  NSGraphicsContext.current = ctx
  ctx.cgContext.setFillColor(NSColor.white.cgColor); ctx.cgContext.fill(CGRect(x:0,y:0,width:w,height:h))
  ctx.cgContext.scaleBy(x: scale, y: scale)
  page.draw(with: .mediaBox, to: ctx.cgContext)
  NSGraphicsContext.restoreGraphicsState()
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: CommandLine.arguments[2] + "-p\(i+1).png"))
}
print("title", doc.documentAttributes?[PDFDocumentAttribute.titleAttribute] ?? "-")
let txt = doc.string ?? ""
try! txt.write(toFile: CommandLine.arguments[2] + ".txt", atomically: true, encoding: .utf8)
