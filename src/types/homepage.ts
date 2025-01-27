export interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  buttonText: string;
  targetSubcategory: string;
}

export interface HomeSectionContextType {
  sections: HomeSection[];
  updateSection: (section: HomeSection) => void;
}