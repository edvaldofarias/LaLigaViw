import {
  Component,
  inject,
  viewChild,
  TemplateRef,
  afterNextRender,
  DestroyRef,
  signal,
} from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MATERIAL } from "./material";
import { createVersionCheck, reloadURL } from "../../../dist/version-check.mjs";
@Component({
  selector: "app-system-dialogs",
  standalone: true,
  imports: [...MATERIAL, MatDialogModule],
  template: `
    <ng-template #install
      ><h2 mat-dialog-title>O campeonato na sua tela inicial</h2>
      <mat-dialog-content
        ><img src="images/app-icon-192.png" width="64" height="64" alt="VIW" />
        <p>Acompanhe jogos, classificação e jogadores pelo ícone do celular.</p>
        @if (prompt()) {
          <button mat-flat-button (click)="installNative()">
            Instalar agora
          </button>
        }
        <p role="status">{{ status() }}</p>
        <h3>iPhone ou iPad</h3>
        <p>
          No Safari, toque em Compartilhar → Adicionar à Tela de Início. Se
          aparecer “Abrir como App da Web”, deixe ativado.
        </p>
        <h3>Android</h3>
        <p>
          No Chrome, use “Instalar agora” ou o menu ⋮ → Instalar app / Adicionar
          à tela inicial.
        </p>
        <p>
          É necessário acesso à internet para atualizar o campeonato. Pelo
          Instagram ou WhatsApp, abra o link no navegador.
        </p></mat-dialog-content
      ><mat-dialog-actions align="end"
        ><button mat-button mat-dialog-close>Fechar</button></mat-dialog-actions
      ></ng-template
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
  private nextVersion = "";
  constructor() {
    afterNextRender(() => {
      const button = document.querySelector<HTMLButtonElement>("#install-app")!;
      const standalone = matchMedia("(display-mode: standalone)");
      const update = () =>
        (button.hidden =
          standalone.matches || (navigator as any).standalone === true);
      update();
      const open = () =>
        this.dialogs.open(this.installTemplate(), {
          maxWidth: "94vw",
          width: "560px",
        });
      button.addEventListener("click", open);
      const before = (e: Event) => {
        e.preventDefault();
        this.prompt.set(e);
      };
      const installed = () => {
        this.prompt.set(null);
        button.hidden = true;
        this.dialogs.closeAll();
      };
      window.addEventListener("beforeinstallprompt", before);
      window.addEventListener("appinstalled", installed);
      standalone.addEventListener("change", update);
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
    } catch {
      this.status.set("Use o menu do navegador para instalar.");
    }
  }
}
