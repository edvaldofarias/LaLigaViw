import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import {
  FirebaseApp,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import {
  Auth,
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxm8BysDScxWV0aToqrz3KqPBNYNdMeBM",
  authDomain: "laligaviw.firebaseapp.com",
  projectId: "laligaviw",
  storageBucket: "laligaviw.firebasestorage.app",
  messagingSenderId: "60493007804",
  appId: "1:60493007804:web:77fc0452392f8bee4a39b9",
  measurementId: "G-1MX8P4WHKE",
};

@Injectable({ providedIn: "root" })
export class VotingService {
  private readonly http = inject(HttpClient);
  readonly credential = signal("");
  readonly message = signal("");
  readonly ready = signal(false);
  readonly signedIn = signal(false);
  private auth?: Auth;
  private app?: FirebaseApp;

  async initialize() {
    if (this.auth) {
      this.ready.set(true);
      return;
    }
    this.message.set("");
    try {
      this.app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      await setPersistence(this.auth, browserLocalPersistence);
      onAuthStateChanged(this.auth, async (user) => {
        this.signedIn.set(!!user);
        this.credential.set(user ? await user.getIdToken() : "");
        this.message.set(
          user
            ? "Conta Google verificada. Sua identidade não será exibida."
            : "",
        );
      });
      this.ready.set(true);
    } catch (error) {
      this.message.set(this.errorMessage(error));
    }
  }

  async signIn() {
    if (!this.auth) return;
    this.message.set("");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(this.auth, provider);
      this.credential.set(await result.user.getIdToken());
      this.signedIn.set(true);
      this.message.set("Conta Google verificada. Sua identidade não será exibida.");
    } catch (error) {
      this.message.set(this.errorMessage(error));
    }
  }

  async signOut() {
    if (!this.auth) return;
    await signOut(this.auth);
    this.credential.set("");
    this.signedIn.set(false);
  }

  async submit(matchId: string, kind: string, ballot: object) {
    await this.refreshCredential();
    return firstValueFrom(
      this.http.post<any>(
        `/api/votes/${encodeURIComponent(matchId)}?kind=${kind}`,
        ballot,
        { headers: { Authorization: `Bearer ${this.credential()}` } },
      ),
    );
  }

  async results(matchId: string, kind: string) {
    await this.refreshCredential();
    return firstValueFrom(
      this.http.get<any>(
        `/api/votes/${encodeURIComponent(matchId)}?kind=${kind}`,
        { headers: { Authorization: `Bearer ${this.credential()}` } },
      ),
    );
  }

  async status() {
    const headers = await this.authorizationHeader();
    return firstValueFrom(
      this.http.get<{
        votes: Array<{
          matchId: string;
          team1BestPlayerId: string;
          team1WorstPlayerId: string;
          team2BestPlayerId: string;
          team2WorstPlayerId: string;
        }>;
      }>("/api/votes/status", { headers }),
    );
  }

  errorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse)
      return error.error?.error || "Não foi possível acessar a votação";
    if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      error.code === "auth/popup-closed-by-user"
    )
      return "Login cancelado";
    return "Não foi possível carregar o login do Google";
  }

  async authorizationHeader() {
    await this.refreshCredential();
    return { Authorization: `Bearer ${this.credential()}` };
  }

  private async refreshCredential() {
    const user = this.auth?.currentUser;
    if (user) this.credential.set(await user.getIdToken());
  }
}
