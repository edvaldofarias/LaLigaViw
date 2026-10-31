import { Component } from "@angular/core";
import { YURICK_WIKI } from "../core/yurick-wiki-data";
import { EncyclopediaWikiComponent } from "../shared/encyclopedia-wiki.component";

@Component({
  selector: "app-wiki-two-page",
  standalone: true,
  imports: [EncyclopediaWikiComponent],
  templateUrl: "./wiki-two-page.component.html",
})
export class WikiTwoPageComponent {
  readonly player = YURICK_WIKI;
}
