import { Component } from "@angular/core";
import { ANDREWS_WIKI } from "../core/andrews-wiki-data";
import { EncyclopediaWikiComponent } from "../shared/encyclopedia-wiki.component";

@Component({
  selector: "app-wiki-three-page",
  standalone: true,
  imports: [EncyclopediaWikiComponent],
  templateUrl: "./wiki-three-page.component.html",
})
export class WikiThreePageComponent {
  readonly player = ANDREWS_WIKI;
}
