import { Member } from "@/models/members/Member";
import { ConceptAggregate } from "@/models/TTConcept/ConceptAggregate";
import { HistoryItem } from "../models/HistoryItem";
import { User } from "../models/user/User";

export interface State {
  loading: Map<string, boolean>;
  conceptIri: "http://www.w3.org/2002/07/owl#Thing";
  conceptAggregate: ConceptAggregate;
  mapped: [];
  usages: [];
  members: Member;
  history: HistoryItem[];
  searchResults: [];
  currentUser: User;
  registeredUsername: string;
  isLoggedIn: boolean;
  snomedLicenseAccepted: string;
  historyCount: number;
  filters: {
    selectedStatus: string[];
    selectedSchemes: { iri: string; name: string }[];
    selectedTypes: string[];
  };
}
