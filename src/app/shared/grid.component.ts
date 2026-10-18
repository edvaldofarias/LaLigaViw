import {
  Component,
  input,
  viewChild,
  computed,
  signal,
  effect,
  inject,
} from "@angular/core";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatSortModule, MatSort } from "@angular/material/sort";
import {
  MatPaginatorModule,
  MatPaginator,
  MatPaginatorIntl,
} from "@angular/material/paginator";
import { MATERIAL } from "./material";
import { EntityComponent } from "./entity.component";
import { CompetitionService } from "../core/competition.service";
export interface GridColumn {
  key: string;
  label: string;
  kind?: "player" | "team" | "coach" | "form" | "points" | "matchup";
  priority?: number;
}
function portuguesePaginator() {
  const p = new MatPaginatorIntl();
  p.itemsPerPageLabel = "Itens por página";
  p.nextPageLabel = "Próxima página";
  p.previousPageLabel = "Página anterior";
  p.firstPageLabel = "Primeira página";
  p.lastPageLabel = "Última página";
  p.getRangeLabel = (page, size, length) =>
    length
      ? `${page * size + 1}–${Math.min((page + 1) * size, length)} de ${length}`
      : "Nenhum registro";
  return p;
}
@Component({
  selector: "app-grid",
  standalone: true,
  imports: [
    ...MATERIAL,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    EntityComponent,
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: portuguesePaginator }],
  template: `
    @if (searchable()) {
      <mat-form-field class="grid-search" appearance="outline"
        ><mat-label>Buscar</mat-label
        ><input
          matInput
          [value]="query()"
          (input)="query.set($any($event.target).value)"
          placeholder="Nome, equipe ou estatística"
      /></mat-form-field>
    }
    <div
      class="material-table-scroll"
      tabindex="0"
      role="region"
      aria-label="Tabela com ordenação por coluna"
    >
      <table mat-table [dataSource]="source" matSort matSortDisableClear>
        @for (c of columns(); track c.key) {
          <ng-container [matColumnDef]="c.key"
            ><th mat-header-cell *matHeaderCellDef [mat-sort-header]="c.key">
              {{ c.label }}
            </th>
            <td mat-cell *matCellDef="let r" [attr.data-label]="c.label">
              @switch (c.kind) {
                @case ("player") {
                  <app-entity [entity]="r" />
                }
                @case ("coach") {
                  <app-entity [entity]="r" kind="coach" />
                }
                @case ("team") {
                  <app-entity [entity]="teamEntity(r, c)" kind="team" />
                }
                @case ("form") {
                  <div class="form">
                    @for (v of r[c.key]; track $index) {
                      <span [class.win]="v === 'V'" [class.loss]="v === 'D'">{{
                        v
                      }}</span>
                    }
                  </div>
                }
                @case ("matchup") {
                  <span>{{ scalar(r, c) }}</span
                  ><small class="cell-note"
                    >Vitória estimada: {{ r.victory }}</small
                  >
                }
                @default {
                  <span [class.score-total]="c.kind === 'points'">{{
                    scalar(r, c)
                  }}</span>
                  @if (c.key === "pts" && r.live) {
                    <small class="live-points-label">previsto</small>
                  }
                }
              }
            </td></ng-container
          >
        }
        <tr mat-header-row *matHeaderRowDef="keys()"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: keys()"
          [class]="row._rowClass || ''"
        ></tr>
        <tr *matNoDataRow>
          <td [attr.colspan]="columns().length" class="empty-grid">
            Nenhum resultado encontrado.
          </td>
        </tr>
      </table>
    </div>
    @if (paged()) {
      <mat-paginator
        [pageSize]="20"
        [pageSizeOptions]="[10, 20, 50, 100]"
        showFirstLastButtons
        aria-label="Paginação da tabela"
      />
    }
  `,
})
export class GridComponent {
  rows = input<any[]>([]);
  columns = input<GridColumn[]>([]);
  paged = input(false);
  searchable = input(false);
  responsive = input(true);
  store = inject(CompetitionService);
  query = signal("");
  keys = computed(() => this.columns().map((c) => c.key));
  source = new MatTableDataSource<any>();
  sort = viewChild(MatSort);
  paginator = viewChild(MatPaginator);
  constructor() {
    effect(() => {
      const rows = this.rows(),
        columns = this.columns(),
        q = this.query().trim();
      let filtered = rows;
      if (q) {
        const text = (r: any) =>
          columns.map((c) => this.scalar(r, c)).join(" ");
        if (window.Fuse) {
          const fuse = new window.Fuse(
            rows.map((r) => ({ r, text: text(r) })),
            {
              keys: ["text"],
              ignoreLocation: true,
              ignoreDiacritics: true,
              threshold: 0.32,
            },
          );
          filtered = fuse.search(q).map((x) => x.item.r);
        } else
          filtered = rows.filter((r) =>
            text(r).toLocaleLowerCase().includes(q.toLocaleLowerCase()),
          );
      }
      this.source.data = filtered;
      this.source.sortingDataAccessor = (r, key) => {
        const c = columns.find((c) => c.key === key)!;
        const v = this.scalar(r, c);
        const numeric = Number(String(v).replace("%", "").replace(",", "."));
        return v !== "" && Number.isFinite(numeric)
          ? numeric
          : String(v).toLocaleLowerCase("pt-BR");
      };
      this.source.sortData = (data, sort) => {
        if (!sort.active || !sort.direction) return data;
        const c = columns.find((c) => c.key === sort.active)!;
        const missing = (v: any) => v == null || v === "" || v === "—";
        const number = (v: any) =>
          Number(String(v).replace("%", "").replace(",", "."));
        return [...data].sort((a, b) => {
          const x = this.scalar(a, c),
            y = this.scalar(b, c);
          if (missing(x) || missing(y))
            return missing(x) === missing(y) ? 0 : missing(x) ? 1 : -1;
          const nx = number(x),
            ny = number(y);
          const order =
            Number.isFinite(nx) && Number.isFinite(ny)
              ? nx - ny
              : String(x).localeCompare(String(y), "pt-BR", { numeric: true });
          return order * (sort.direction === "asc" ? 1 : -1);
        });
      };
      this.source.sort = this.sort() || null;
      this.source.paginator = this.paginator() || null;
    });
    effect(() => {
      this.query();
      this.paginator()?.firstPage();
    });
  }
  scalar(r: any, c: GridColumn): any {
    if (c.kind === "team")
      return this.store.team(r[c.key])?.name || r.teamName || "";
    if (c.kind === "form") return (r[c.key] || []).join("");
    return r[c.key] ?? "—";
  }
  teamEntity(r: any, c: GridColumn) {
    return {
      ...(this.store.team(r[c.key]) || { name: r.teamName }),
      id: r[c.key],
    };
  }
}
