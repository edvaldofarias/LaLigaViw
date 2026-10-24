import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { VotingService } from "./voting.service";

export interface PoolPrediction {
  matchId: string;
  homeScore: number;
  awayScore: number;
}

export interface PoolResult {
  live?: boolean;
  matchId: string;
  roundId: string;
  homeTeamId: string;
  awayTeamId: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
  actualHomeScore: number;
  actualAwayScore: number;
  points: number;
  correct: boolean;
  exact: boolean;
}

export interface PoolRankingEntry {
  position: number;
  nickname: string;
  points: number;
  exact: number;
  hits: number;
  predictions: number;
  results: PoolResult[];
}

@Injectable({ providedIn: "root" })
export class PoolService {
  private readonly http = inject(HttpClient);
  private readonly voting = inject(VotingService);

  async entry(roundId: string) {
    const headers = await this.voting.authorizationHeader();
    return firstValueFrom(
      this.http.get<{
        nickname: string;
        predictions: PoolPrediction[];
      }>(`/api/pool/entry?roundId=${encodeURIComponent(roundId)}`, {
        headers,
      }),
    );
  }

  async save(
    roundId: string,
    predictions: PoolPrediction[],
  ) {
    const headers = await this.voting.authorizationHeader();
    return firstValueFrom(
      this.http.post<{ saved: number; lockAt: string }>(
        "/api/pool/entry",
        { roundId, predictions },
        {
          headers,
        },
      ),
    );
  }

  async ranking() {
    return firstValueFrom(
      this.http.get<{ ranking: PoolRankingEntry[] }>("/api/pool/ranking"),
    );
  }
}
