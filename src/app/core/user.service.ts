import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { VotingService } from "./voting.service";

export interface UserProfile {
  name: string;
  email: string;
  nickname: string | null;
}

@Injectable({ providedIn: "root" })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly voting = inject(VotingService);

  async profile() {
    const headers = await this.voting.authorizationHeader();
    return firstValueFrom(
      this.http.get<{ profile: UserProfile }>("/api/user/profile", {
        headers,
      }),
    );
  }

  async updateNickname(nickname: string) {
    const headers = await this.voting.authorizationHeader();
    return firstValueFrom(
      this.http.put<{ profile: UserProfile }>(
        "/api/user/profile",
        { nickname },
        { headers },
      ),
    );
  }

  async deleteEverything() {
    const headers = await this.voting.authorizationHeader();
    return firstValueFrom(
      this.http.delete<{ deleted: boolean }>("/api/user/profile", { headers }),
    );
  }
}
