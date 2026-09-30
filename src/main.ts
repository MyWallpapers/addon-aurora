import type { CanvasAddonMountContext } from "../generated/mywallpaper-runtime";
import { drawing } from "./drawing";
import "./style.css";

export function mount(context: CanvasAddonMountContext) {
  let values = context.layer.settings.get();
  const view = drawing(
    context,
    "Des voiles d’aurore boréale qui se déploient lentement au-dessus d’un horizon sombre.",
    (g, w, h, t) => {
      g.fillStyle = String(values.sky ?? "#090f1b");
      g.fillRect(0, 0, w, h);
      const speed = Number(values.speed ?? 1);
      g.globalCompositeOperation = "screen";
      for (let band = 0; band < 3; band++) {
        for (let strand = 0; strand < 24; strand++) {
          g.globalAlpha = 0.015 + 0.009 * Math.sin((strand / 24) * Math.PI);
          g.strokeStyle = String(
            band % 2
              ? (values.secondary ?? "#8b85a7")
              : (values.light ?? "#7cacaa"),
          );
          g.lineWidth = h * 0.012;
          g.beginPath();
          for (let x = 0; x <= w; x += w / 90) {
            const s = x / w,
              y =
                h *
                (0.24 +
                  band * 0.12 +
                  strand * 0.004 +
                  0.1 * Math.sin(s * 5.1 + t * speed * 0.09 + band) +
                  0.055 * Math.sin(s * 9 - t * speed * 0.07 + strand * 0.025));
            if (x === 0) g.moveTo(x, y);
            else g.lineTo(x, y);
          }
          g.stroke();
        }
      }
    },
  );
  const update = (next: typeof values) => {
    values = next;
    view.invalidate(next.motion !== false);
  };
  update(values);
  const stop = context.layer.settings.subscribe(update);
  return () => {
    stop();
    view.dispose();
  };
}
