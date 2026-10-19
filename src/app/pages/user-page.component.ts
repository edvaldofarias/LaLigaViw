import {
  Component,
  afterNextRender,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MATERIAL } from "../shared/material";
import { UserProfile, UserService } from "../core/user.service";
import { VotingService } from "../core/voting.service";

@Component({
  selector: "app-user-page",
  standalone: true,
  imports: [...MATERIAL, FormsModule],
  templateUrl: "./user-page.component.html",
})
export class UserPageComponent {
  readonly voting = inject(VotingService);
  private readonly users = inject(UserService);
  readonly profile = signal<UserProfile | null>(null);
  readonly nickname = signal("");
  readonly feedback = signal("");
  readonly busy = signal(false);

  constructor() {
    afterNextRender(() => this.voting.initialize());
    effect(() => {
      if (this.voting.credential()) void this.load();
      else this.profile.set(null);
    });
  }

  async saveNickname() {
    this.busy.set(true);
    this.feedback.set("");
    try {
      const result = await this.users.updateNickname(this.nickname());
      this.profile.set(result.profile);
      this.nickname.set(result.profile.nickname || "");
      this.feedback.set("Apelido salvo.");
    } catch (error) {
      this.feedback.set(this.voting.errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }

  async deleteEverything() {
    const confirmed = window.confirm(
      "Excluir permanentemente seus votos, avaliações, palpites, ranking e dados pessoais deste aplicativo?",
    );
    if (!confirmed) return;
    this.busy.set(true);
    try {
      await this.users.deleteEverything();
      await this.voting.signOut();
      this.profile.set(null);
      this.nickname.set("");
      this.feedback.set("Todos os seus dados foram excluídos.");
    } catch (error) {
      this.feedback.set(this.voting.errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }

  private async load() {
    try {
      const result = await this.users.profile();
      this.profile.set(result.profile);
      this.nickname.set(result.profile.nickname || "");
    } catch (error) {
      this.feedback.set(this.voting.errorMessage(error));
    }
  }
}
