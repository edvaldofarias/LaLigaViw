import {
  Component,
  input,
  viewChild,
  ElementRef,
  afterRenderEffect,
  inject,
  DestroyRef,
} from "@angular/core";
@Component({
  selector: "app-chart",
  standalone: true,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      figure {
        margin: 0;
        padding: 0;
      }
      .chart-canvas-wrap {
        height: 330px;
        position: relative;
        width: 100%;
      }
      .chart-legend {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 8px;
        margin-top: 20px;
      }
      .chart-legend button {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        min-height: 44px;
        padding: 8px;
        border: 1px solid #e1e7ed;
        border-radius: 8px;
        background: #fff;
        text-align: left;
        font-size: 12px;
        line-height: 1.4;
      }
      .chart-legend button[aria-pressed="false"] {
        opacity: 0.45;
      }
      .chart-legend img {
        display: block;
        width: 22px;
        height: 24px;
        max-width: 22px;
        max-height: 24px;
        object-fit: contain;
        flex: 0 0 22px;
      }
      .chart-legend i {
        display: block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex: 0 0 7px;
      }
      .chart-legend span {
        min-width: 0;
      }
      .chart-values {
        margin-top: 16px;
        font-size: 12px;
      }
      figcaption {
        margin-bottom: 14px;
        font-size: 14px;
      }
      @media (max-width: 600px) {
        .chart-canvas-wrap {
          height: 280px;
        }
        .chart-legend {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
        }
      }
    `,
  ],
  template: `<figure class="evolution-chart">
    <figcaption>{{ title() }}</figcaption>
    <div class="chart-canvas-wrap">
      <canvas #canvas role="img" [attr.aria-label]="title()"></canvas>
    </div>
    <div class="chart-legend">
      @for (s of series(); track s.name; let i = $index) {
        <button
          type="button"
          [attr.aria-pressed]="visible(i)"
          (click)="toggle(i)"
        >
          <i [style.background]="s.color || '#527428'"></i>
          @if (s.logo) {
            <img [src]="s.logo" alt="" loading="lazy" />
          }
          <span>{{ s.name }}</span>
        </button>
      }
    </div>
    <details class="chart-values">
      <summary>Consultar valores do gráfico</summary>
      @for (s of series(); track s.name) {
        <p>
          <b>{{ s.name }}</b
          >:
          @for (p of s.values; track p.round) {
            R{{ p.round }}: {{ p.value ?? "—" }}{{ rank() ? "º" : " pontos" }} ·
          }
        </p>
      }
    </details>
  </figure>`,
})
export class ChartComponent {
  title = input("");
  series = input<any[]>([]);
  rank = input(false);
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>("canvas");
  private chart: any;
  private hidden = new Set<number>();
  constructor() {
    afterRenderEffect(() => {
      const series = this.series(),
        rank = this.rank(),
        canvas = this.canvas().nativeElement;
      this.chart?.destroy();
      if (!window.Chart || !series.some((s) => s.values.length)) return;
      const rounds = Math.max(
        ...series.flatMap((s) => s.values.map((v) => v.round)),
      );
      const logos = series.map((s) => {
        if (!s.logo) return null;
        const img = new Image();
        img.src = s.logo;
        return img;
      });
      this.chart = new window.Chart(canvas, {
        type: "line",
        data: {
          labels: Array.from({ length: rounds }, (_, i) => "R" + (i + 1)),
          datasets: series.map((s) => ({
            label: s.name,
            data: Array.from(
              { length: rounds },
              (_, i) => s.values.find((p) => p.round === i + 1)?.value ?? null,
            ),
            borderColor: s.color || "#527428",
            backgroundColor: s.color || "#527428",
            borderWidth: 1.2,
            pointRadius: 2,
            pointHoverRadius: 5,
            tension: 0,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: { mode: "index", intersect: false },
          layout: { padding: { left: 20 } },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx: any) =>
                  `${ctx.dataset.label}: ${ctx.parsed.y}${rank ? "º" : " pontos"}`,
              },
            },
          },
          scales: {
            x: { grid: { display: false } },
            y: {
              reverse: rank,
              min: rank ? 1 : undefined,
              beginAtZero: !rank,
              ticks: {
                precision: 0,
                callback: (v: any) => (rank ? v + "º" : v),
              },
            },
          },
        },
        plugins: [
          {
            id: "teamLogos",
            afterDatasetsDraw: (chart: any) =>
              logos.forEach((img, i) => {
                if (
                  img?.complete &&
                  img.naturalWidth &&
                  chart.isDatasetVisible(i)
                ) {
                  const pt = chart
                    .getDatasetMeta(i)
                    .data.find(
                      (_: any, j: number) =>
                        chart.data.datasets[i].data[j] != null,
                    );
                  if (pt) chart.ctx.drawImage(img, pt.x - 20, pt.y - 7, 14, 14);
                }
              }),
          },
        ],
      });
      logos.forEach((img) => {
        if (img)
          img.onload = () => {
            if (this.chart?.ctx && canvas.isConnected) this.chart.draw();
          };
      });
      this.hidden.clear();
    });
    inject(DestroyRef).onDestroy(() => {
      this.chart?.destroy();
      this.chart = undefined;
    });
  }
  visible(i: number) {
    return !this.hidden.has(i);
  }
  toggle(i: number) {
    if (this.hidden.has(i)) this.hidden.delete(i);
    else this.hidden.add(i);
    this.chart?.setDatasetVisibility(i, !this.hidden.has(i));
    this.chart?.update();
  }
}
