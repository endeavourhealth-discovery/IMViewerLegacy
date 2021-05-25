import { Member } from "@/models/members/Member";
import { ConceptAggregate } from "@/models/TTConcept/ConceptAggregate";
import { CancelTokenSource } from "axios";
import { HistoryItem } from "../models/HistoryItem";
import { User } from "../models/user/User";

export interface State {
  loading: Map<string, boolean>;
  cancelSource: CancelTokenSource;
  conceptIri: "http://www.w3.org/2002/07/owl#Thing";
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
  focusTree: boolean;
  treeLocked: boolean;
  filters: {
    selectedStatus: string[];
    selectedSchemes: { iri: string; name: string }[];
    selectedTypes: string[];
  };
}
