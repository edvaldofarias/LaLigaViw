import {
  Component,
  inject,
  viewChild,
  TemplateRef,
  afterNextRender,
  DestroyRef,
  signal,
} from "@angular/core";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MATERIAL } from "./material";
import { createVersionCheck, reloadURL } from "../../../dist/version-check.mjs";
@Component({
  selector: "app-system-dialogs",
  standalone: true,
  imports: [...MATERIAL, MatDialogModule],
  template: `
    <ng-template #install
      ><div class="install-prompt-hero">
        <img src="images/app-icon-192.png" width="72" height="72" alt="VIW" />
        <div>
          <span>Aplicativo La Liga VIW</span>
          <h2 mat-dialog-title>Leve o campeonato com você</h2>
          <p>
            Este site pode funcionar como um aplicativo no seu celular, com
            acesso rápido pela tela inicial.
          </p>
        </div>
      </div>
      <mat-dialog-content class="install-prompt-content">
        <div class="install-benefits">
          <span><b>⚽</b> Jogos e resultados</span>
          <span><b>↗</b> Classificação atualizada</span>
          <span><b>★</b> MVP e destaques</span>
        </div>
        @if (prompt()) {
          <p class="install-guidance">
            Toque em <b>Instalar aplicativo</b> e confirme no navegador.
          </p>
        } @else if (isIOS()) {
          <p class="install-guidance">
            No Safari, toque em <b>Compartilhar</b> e depois em
            <b>Adicionar à Tela de Início</b>.
          </p>
        } @else {
          <p class="install-guidance">
            Abra o menu do navegador e escolha <b>Instalar aplicativo</b> ou
            <b>Adicionar à tela inicial</b>.
          </p>
        }
        <p role="status">{{ status() }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="install-prompt-actions">
        <button mat-button id="decline-install" (click)="declineInstall()">
          Agora não
        </button>
        @if (prompt()) {
          <button
            mat-flat-button
            id="confirm-install"
            (click)="installNative()"
          >
            Instalar aplicativo
          </button>
        } @else {
          <button mat-flat-button (click)="closeInstall()">Entendi</button>
        }
      </mat-dialog-actions></ng-template
    >
    <ng-template #version
      ><h2 mat-dialog-title>Uma nova versão está disponível</h2>
      <mat-dialog-content
        ><p>
          Recarregue a página para ver as novidades. Você continuará na mesma
          aba.
        </p></mat-dialog-content
      ><mat-dialog-actions align="end"
        ><button mat-button mat-dialog-close>Depois</button
        ><button mat-flat-button (click)="reload()">
          Recarregar agora
        </button></mat-dialog-actions
      ></ng-template
    >
  `,
})
export class SystemDialogsComponent {
  private dialogs = inject(MatDialog);
  private destroy = inject(DestroyRef);
  installTemplate = viewChild.required<TemplateRef<any>>("install");
  versionTemplate = viewChild.required<TemplateRef<any>>("version");
  prompt = signal<any>(null);
  status = signal("");
  isIOS = signal(false);
  private nextVersion = "";
  private installRef?: MatDialogRef<any>;
  private readonly declinedKey = "laliga-install-declined";
  constructor() {
    afterNextRender(() => {
      const button = document.querySelector<HTMLButtonElement>("#install-app")!;
      const standalone = matchMedia("(display-mode: standalone)");
      const isInstalled = () =>
        standalone.matches || (navigator as any).standalone === true;
      const update = () => {
        button.hidden = isInstalled();
        if (isInstalled()) this.closeInstall();
      };
      update();
      this.isIOS.set(
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
          ((navigator as any).standalone !== undefined &&
            navigator.platform === "MacIntel"),
      );
      const open = () => this.openInstall(false);
      button.addEventListener("click", open);
      const before = (e: Event) => {
        e.preventDefault();
        this.prompt.set(e);
        this.openAutomaticInstall(isInstalled());
      };
      const installed = () => {
        this.prompt.set(null);
        button.hidden = true;
        this.closeInstall();
      };
      window.addEventListener("beforeinstallprompt", before);
      window.addEventListener("appinstalled", installed);
      standalone.addEventListener("change", update);
      this.openAutomaticInstall(isInstalled());
      const current = document.querySelector<HTMLMetaElement>(
        'meta[name="app-version"]',
      )?.content;
      let timer: any;
      if (/^[a-f0-9]{16}$/.test(current || "")) {
        const check = createVersionCheck(
          current,
          async () => {
            const r = await fetch("/api/version", {
              cache: "no-store",
              signal: AbortSignal.timeout(8000),
            });
            if (!r.ok) throw Error();
            return r.json();
          },
          (data) => {
            this.nextVersion = data.version;
            if (data.forceReload === true) {
              try {
                if (
                  sessionStorage.getItem("laliga-version-reload") !==
                  data.version
                ) {
                  sessionStorage.setItem("laliga-version-reload", data.version);
                  this.reload();
                  return;
                }
              } catch {}
            }
            this.dialogs.open(this.versionTemplate(), {
              maxWidth: "94vw",
              width: "480px",
            });
          },
        );
        const visible = () => {
          if (document.visibilityState === "visible") void check();
        };
        document.addEventListener("visibilitychange", visible);
        window.addEventListener("online", visible);
        timer = setInterval(visible, 60000);
        visible();
        this.destroy.onDestroy(() => {
          clearInterval(timer);
          document.removeEventListener("visibilitychange", visible);
          window.removeEventListener("online", visible);
        });
      }
      this.destroy.onDestroy(() => {
        button.removeEventListener("click", open);
        window.removeEventListener("beforeinstallprompt", before);
        window.removeEventListener("appinstalled", installed);
        standalone.removeEventListener("change", update);
      });
    });
  }
  reload() {
    location.assign(reloadURL(location.href, this.nextVersion));
  }
  private openAutomaticInstall(installed: boolean) {
    if (
      installed ||
      !matchMedia("(max-width: 700px), (pointer: coarse)").matches ||
      this.installWasDeclined()
    ) {
      return;
    }
    this.openInstall(true);
  }
  private openInstall(automatic: boolean) {
    if (this.installRef) return;
    this.status.set("");
    const ref = this.dialogs.open(this.installTemplate(), {
      maxWidth: "94vw",
      width: "520px",
      panelClass: "install-dialog",
      disableClose: automatic,
      autoFocus: false,
    });
    this.installRef = ref;
    ref.afterClosed().subscribe(() => {
      if (this.installRef === ref) this.installRef = undefined;
    });
  }
  private installWasDeclined() {
    try {
      return localStorage.getItem(this.declinedKey) === "1";
    } catch {
      return false;
    }
  }
  declineInstall() {
    try {
      localStorage.setItem(this.declinedKey, "1");
    } catch {}
    this.closeInstall();
  }
  closeInstall() {
    const ref = this.installRef;
    this.installRef = undefined;
    ref?.close();
  }
  async installNative() {
    const p = this.prompt();
    if (!p) return;
    this.prompt.set(null);
    try {
      await p.prompt();
      const choice = await p.userChoice;
      this.status.set(
        choice.outcome === "accepted"
          ? "Instalação solicitada. Confirme as etapas do navegador."
          : "Você pode instalar depois pelo menu do navegador.",
      );
      if (choice.outcome === "accepted") this.closeInstall();
    } catch {
      this.status.set("Use o menu do navegador para instalar.");
    }
  }
}
