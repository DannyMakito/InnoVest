export interface SouthAfricanBank {
  id: string;
  name: string;
  shortName: string;
  branchCode: string;
  color: string;
}

// Universal branch codes for major South African banks
export const saBanks: SouthAfricanBank[] = [
  { id: "capitec", name: "Capitec Bank", shortName: "Capitec", branchCode: "470010", color: "#6B7220" },
  { id: "fnb", name: "FNB", shortName: "FNB", branchCode: "250655", color: "#D4AF37" },
  { id: "standard-bank", name: "Standard Bank", shortName: "Standard Bank", branchCode: "051001", color: "#556B2F" },
  { id: "absa", name: "ABSA", shortName: "ABSA", branchCode: "632005", color: "#8B7355" },
  { id: "nedbank", name: "Nedbank", shortName: "Nedbank", branchCode: "198765", color: "#003B5C" },
  { id: "african-bank", name: "African Bank", shortName: "African Bank", branchCode: "430000", color: "#E31837" },
  { id: "tymebank", name: "TymeBank", shortName: "TymeBank", branchCode: "678910", color: "#00C4B4" },
  { id: "discovery", name: "Discovery Bank", shortName: "Discovery", branchCode: "679000", color: "#006B5E" },
];
