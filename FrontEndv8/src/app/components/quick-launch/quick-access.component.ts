import { Component, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { CookieService } from 'ngx-cookie-service';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';
import { Perspective } from 'src/app/models/Perspective';
import { codeSchemesProvider } from 'src/app/models/search/CodeScheme';
import { ConceptService } from 'src/app/services/concept.service';
import { ConfigService } from 'src/app/services/config.service';
import { LoggerService } from 'src/app/services/logger.service';
import { Perspectives } from 'src/app/services/perspective.service';

interface Category {
  name: string,
  icon: string,
  color: string,
  members: ConceptReference[]
}

class RecentConcepts {

    private static COOKIE_NAME:string = "app:Cookie-RecentConcepts";

    constructor(private cookieService: CookieService, private log: LoggerService, private recentConceptsMaxSize: number = 5) {}

    getRecentConcepts(): ConceptReference[] {
        let recentConcepts: ConceptReference[] = [];

        const cookie: string = this.getCookie();
        if(cookie != null) {
            recentConcepts = JSON.parse(cookie);

            recentConcepts = recentConcepts.filter(recentConcept => { return recentConcept != null; });
        }

        return recentConcepts;
    }

    addRecentConcept(candidateRecentConcept: ConceptReference): boolean {
        let success: boolean = false;
        
        let recentConcepts: ConceptReference[] = this.getRecentConcepts();
        
        // only add the concept if it isn't already in the list
        if (recentConcepts.some(recentConcept => recentConcept.iri == candidateRecentConcept.iri) == false) {
          recentConcepts.unshift(candidateRecentConcept);
  
          // make sure that the list never exceeds the max size
          if(recentConcepts.length > this.recentConceptsMaxSize) {
              recentConcepts = recentConcepts.slice(0, this.recentConceptsMaxSize - 1);
          }

          success = this.setCookie(JSON.stringify(recentConcepts));
        }
        else {
          success = true;
          this.log.debug(`Debug - the concept ${candidateRecentConcept.iri} is already in the list of recent concepts therefore it will not be re-added.`);
        }
        
        return success;
    }

    private getCookie(): string {
        let cookie: string;
        
        if(this.cookieService.check(RecentConcepts.COOKIE_NAME)) {
            cookie= this.cookieService.get(RecentConcepts.COOKIE_NAME);
        }

        return cookie;
    }

    private setCookie(cookie: string): boolean {
        this.cookieService.set(RecentConcepts.COOKIE_NAME, cookie);

        return true;
    }   
}

@Component({
  selector: 'app-quick-access',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss'],
  providers: [ codeSchemesProvider ]
})
export class QuickAccessComponent implements OnInit  {

  public categories: Category[];

  private selectedCategoryMember: string; 
  private selectedRecentConcept: string;  

  private _recentConcepts: RecentConcepts;

  constructor(private eventBus: NgEventBus, 
              private cookieService: CookieService,
              private perpsectiveService: Perspectives,
              private conceptService: ConceptService, 
              private configService: ConfigService,
              private log: LoggerService) {

    this.initCategories().subscribe(
      categories => { 
        this.categories = categories 
      },
      error => { 
        this.log.debug(`Warning - unable to get categories. Cause - ${error}. Action - no categories will be displayed.`) 
      }
    );
    this._recentConcepts = new RecentConcepts(cookieService, log);  
  }

  ngOnInit(): void {
    // whenever the user selects a concept store it in the list of recent concepts
    this.eventBus.on('app:conceptSelect').subscribe((iri: string) => {  
      this.conceptService.getConcept(iri).subscribe(
            concept => { 
                if(this._recentConcepts.addRecentConcept({name: concept.name, iri: concept.iri}) == false) {
                    this.log.debug(`Warning - unable to add concept ${iri} to list of recent concepts`);
                }
            },
            error => { 
                this.log.error(`Error - problem retrieiving concept for selected iri (${iri}). Cause - ${error}`) 
            }
        )
    }); 
  }

  get recentConcepts() {
      return this._recentConcepts.getRecentConcepts();
  }

  get hasRecentlyVisited() {
    return this.recentConcepts.length > 0;
  }

  get hasCategories() {
    return this.categories != null && this.categories.length > 0;
  }

  onSelectCategoryMember(member: ConceptReference) {
    this.selectedCategoryMember = member.iri;
    this.selectedRecentConcept = null;
    this.eventBus.cast('app:conceptSelect', member.iri);
  }

  highlightCategoryMember(member: ConceptReference): boolean {
    return this.selectedCategoryMember && this.selectedCategoryMember == member.iri;
  } 

  onSelectRecentConcept(concept: ConceptReference) {
    this.selectedRecentConcept = concept.iri;
    this.selectedCategoryMember = null;
    this.eventBus.cast('app:conceptSelect', concept.iri);
  }

  highlightRecentConcept(concept: ConceptReference): boolean {
    return this.selectedRecentConcept && this.selectedRecentConcept == concept.iri;
  } 

  private initCategories(): Observable<Category[]> {
    let categoriesObservable: Subject<Category[]> = new ReplaySubject();

    this.configService.getQuickAccess().subscribe(
      quickAccessList => { 
        let categories: Map<string, Category> = new Map();
        quickAccessList.forEach(quickAccess => {
          const perspective: Perspective = this.getPerspective(quickAccess.types);
          
          if(perspective != null) {
            this.addCategoryMember(categories, perspective, quickAccess);
          }
          else {
            this.log.debug(`Warning - no perspective associated with the quick access concept ${quickAccess.iri}. It will not be displayed.`) 
          }
        });

        categoriesObservable.next(Array.from(categories.values()));
      },
      error => { 
        this.log.debug(`Warning - unable to retrieve quick access config. Cause - ${error}`) 
      }
    );
 
    return categoriesObservable;
  }

  private getPerspective(types: ConceptReference[]) {
    // default value
    let rootIri: string = this.perpsectiveService.ontology.root;
              
    if(types.length > 0) {
      if(types.length > 1) {
        this.log.debug(`Warning - multiple types found. Using the first type to resolve perspective. Ignoring others.`) 
      }
      rootIri = types[0].iri;
    }

    const perspective: Perspective = this.perpsectiveService.getPerspectiveByRoot(rootIri);

    return perspective;
  }

  private addCategoryMember(categories: Map<string, Category>, perspective: Perspective, member: ConceptReference): void {
    let category: Category = categories.get(perspective.root);
            
    category = this.createOrUpdateCategory(category, perspective, member);
    
    if(categories.has(perspective.root) == false) {
      categories.set(perspective.root, category);
    }   
  }

  private createOrUpdateCategory(category: Category, perspective: Perspective, member: ConceptReference): Category {
    if(category == null) {
      category = {
        name: perspective.caption,
        icon: perspective.icon,
        color: perspective.color,
        members: []
      }   
    }

    category.members.push(member);

    return category;
  }
}
