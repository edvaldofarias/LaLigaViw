import { Component } from "@angular/core";
import { EDVALDO_WIKI } from "../core/wiki-data";
import { EncyclopediaWikiComponent } from "../shared/encyclopedia-wiki.component";

@Component({
  selector: "app-wiki-page",
  standalone: true,
  imports: [EncyclopediaWikiComponent],
  templateUrl: "./wiki-page.component.html",
})
export class WikiPageComponent {
  readonly player = EDVALDO_WIKI;
}
